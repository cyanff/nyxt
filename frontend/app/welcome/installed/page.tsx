import Link from "next/link";

export default function Installed() {
  return (
    <div className="bg-gradient-pink2 w-screen h-screen flex flex-col items-center pt-16 px-16">
      <h1 className="shrink-0 text-5xl text-center text-gray-700 font-semibold mb-4 font-atkinson tracking-wide">
        Thanks for install Nyxt!
      </h1>
      <h2 className="text-xl font-semibold text-center text-gray-600 mb-10">
        Here are some great articles for you to summarize
      </h2>

      <div className="grow flex flex-col justify-center animate-fadeInSlide1">
        <div className="grid grid-cols-3 w-[50rem] gap-6">
          <Link
            href="https://blog.gregbrockman.com/how-i-became-a-machine-learning-practitioner"
            target="_blank"
          >
            <div className="bg-white hover:scale-105 transition ease-out duration-1000 rounded-3xl aspect-square p-6 flex flex-col justify-center items-center">
              <h2 className="text-xl text-center text-gray-600 font-medium mb-4 font-inter tracking-wide">
                How I Became an ML Practitioner
              </h2>
              <h3 className="text-lg font-medium text-center text-gray-400">
                Greg Brockman
              </h3>
            </div>
          </Link>

          <Link href="https://paulgraham.com/ds.html" target="_blank">
            <div className="bg-white hover:scale-105  transition ease-out duration-1000 rounded-3xl aspect-square p-6 flex flex-col justify-center items-center">
              <h2 className="text-xl text-center text-gray-600 font-medium mb-4 font-inter tracking-wide">
                Do Things That Don't Scale
              </h2>
              <h3 className="text-lg font-medium text-center text-gray-400">
                Paul Graham
              </h3>
            </div>
          </Link>

          <Link
            href="http://www.incompleteideas.net/IncIdeas/BitterLesson.html"
            target="_blank"
          >
            <div className="bg-white hover:scale-105  transition ease-out duration-1000 rounded-3xl aspect-square p-6 flex flex-col justify-center items-center">
              <h2 className="text-xl text-center text-gray-600 font-medium mb-4 font-inter tracking-wide">
                The Bitter Lesson
              </h2>
              <h3 className="text-lg font-medium text-center text-gray-400">
                Rich Sutton
              </h3>
            </div>
          </Link>

          <Link
            href="https://dashbit.co/blog/elixir-and-machine-learning-q3-roundup"
            target="_blank"
          >
            <div className="bg-white hover:scale-105  transition ease-out duration-1000 rounded-3xl aspect-square p-6 flex flex-col justify-center items-center">
              <h2 className="text-xl text-center text-gray-600 font-medium mb-4 font-inter tracking-wide">
                Elixir and Machine Learning
              </h2>
              <h3 className="text-lg font-medium text-center text-gray-400">
                José Valim
              </h3>
            </div>
          </Link>

          <Link href="https://huggingface.co/blog/moe" target="_blank">
            <div className="bg-white hover:scale-105  transition ease-out duration-1000 rounded-3xl aspect-square p-6 flex flex-col justify-center items-center">
              <h2 className="text-xl text-center text-gray-600 font-medium mb-4 font-inter tracking-wide">
                Mixture of Experts Explained
              </h2>
              <h3 className="text-lg font-medium text-center text-gray-400">
                Various Authors
              </h3>
            </div>
          </Link>
          <Link
            href="https://developer.nvidia.com/blog/cuda-refresher-cuda-programming-model/"
            target="_blank"
          >
            <div className="bg-white hover:scale-105  transition ease-out duration-1000 rounded-3xl aspect-square p-6 flex flex-col justify-center items-center">
              <h2 className="text-xl text-center text-gray-600 font-medium mb-4 font-inter tracking-wide">
                Cuda Refresher
              </h2>
              <h3 className="text-lg font-medium text-center text-gray-400">
                Pradeep Gupta
              </h3>
            </div>
          </Link>
        </div>
      </div>

      <div className="w-screen flex flex-row justify-end px-4 py-3">
        <Link
          href="https://github.com/cyanff/nyxt"
          className="bg-clear inline-flex items-center py-2"
          target="_blank"
        >
          <img
            src="/github-icon.svg"
            alt="Github Repo Link"
            className="h-10 w-10"
          />
        </Link>
      </div>
    </div>
  );
}
