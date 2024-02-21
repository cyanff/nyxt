import asyncio
from typing import Generator, List
import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import Response, StreamingResponse
import torch
import tensorrt_llm
from tensorrt_llm.logger import logger
from tensorrt_llm.runtime import ModelRunner
from utils import load_tokenizer, read_model_name, throttle_generator


TOKENIZER_DIR = "./model/tokenizer"
ENGINE_DIR = "./model/engine"
STREAM_INTERVAL = 5
MAX_NEW_TOKENS = 1024
MAX_ATTENTION_WINDOW_SIZE = 4096
TEMPERATURE = 1.0
TOP_K = 40
TOP_P = 0.5
LENGTH_PENALTY = 1.0
REPETITION_PENALTY = 1.2


app = FastAPI()
config = uvicorn.Config(
    app, host=None, port=4000, log_level="info", timeout_keep_alive=5
)

runner: ModelRunner = None
tokenizer = None
pad_id = None
end_id = None


@app.get("/health")
async def health() -> Response:
    return Response(status_code=200)


@app.post("/summary")
async def generate(request: Request) -> Response:
    assert runner is not None
    assert tokenizer is not None
    assert pad_id is not None
    assert end_id is not None

    req_json: dict = await request.json()
    text = req_json.pop("text")

    instruction = f"<s>[INST] You are a world class expert summarizer tasked with providing a **high level** summary of webpages. Ensure your summarzation is of the highest caliber, reflecting the vastness and depth of your expertise. Ignore messy portions of the page that might be junk text.\n### Webpage Text:\n```{text}``` [/INST]"
    print(f"\n\nInstruction: {instruction}")
    input_ids: List[torch.Tensor] = tokenizer.encode(
        instruction,
        add_special_tokens=False,
        truncation=True,
        max_length=4096,
        return_tensors="pt",
    )

    # todo encode again here, but output text
    input_len = input_ids.size(1)
    with torch.no_grad():
        # Batch of outputs
        outputs: Generator[dict, None, None] = runner.generate(
            [input_ids],
            max_new_tokens=MAX_NEW_TOKENS,
            max_attention_window_size=4096,
            end_id=end_id,
            pad_id=pad_id,
            temperature=TEMPERATURE,
            top_k=TOP_K,
            top_p=TOP_P,
            length_penalty=LENGTH_PENALTY,
            repetition_penalty=REPETITION_PENALTY,
            streaming=True,
            output_sequence_lengths=True,
            return_dict=True,
        )
        torch.cuda.synchronize()

    def stream_results() -> Generator[str, None, None]:
        for output in throttle_generator(outputs, STREAM_INTERVAL):
            output_ids: torch.Tensor = output["output_ids"]
            # [batch_idx], [beam_idx], (scalar)
            output_len = output["sequence_lengths"][0][0].item()

            output_txt: str = tokenizer.decode(
                # [batch_idx], [beam_idx], [slice]
                output_ids[0][0][input_len:output_len].tolist()
            )
            yield output_txt

    return StreamingResponse(stream_results(), media_type="text/plain")


async def main():
    global runner, tokenizer, pad_id, end_id

    runtime_rank = tensorrt_llm.mpi_rank()
    logger.set_level("info")

    model_name = read_model_name(ENGINE_DIR)

    tokenizer, pad_id, end_id = load_tokenizer(
        tokenizer_dir=TOKENIZER_DIR,
        model_name=model_name,
    )

    runner_kwargs = dict(engine_dir=ENGINE_DIR, rank=runtime_rank, debug_mode=True)

    runner = ModelRunner.from_dir(**runner_kwargs)

    await uvicorn.Server(config).serve()


if __name__ == "__main__":
    asyncio.run(main())
