import tailwindCSS from "bundle-text:../styles/globals.css";
import overlayCSS from "bundle-text:../styles/overlay.css";
import fontsCSS from "bundle-text:../styles/fonts.css";
import { html } from "code-tag";
import {
  getCloseHandler,
  getHandleHandler,
  getResizerHandler,
} from "./event-handlers";
import { createToast } from "./create-toast";
import { Readability } from "@mozilla/readability";
import { StreamingResult } from "../background";

// ======================================================================
// Handles messages from the background script
// ======================================================================
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.action === "showOverlay") {
    // Unhide the overlay
    sr.getElementById("overlay").setAttribute("style", "display: flex;");
  }
});

const htmlData = html`
  <style>
    ${overlayCSS}
  </style>
  <style>
    ${tailwindCSS}
  </style>
  <div
    id="overlay"
    class="flex flex-col fixed w-[35vh] h-[56vh] auto bottom-10 right-10 z-[10000] min-w-64 bg-white rounded-2xl" 
  >
    <div
      id="handle"
      class="shrink-0 h-fit cursor-move  text-gray-800 font-semibold py-2.5 px-5 flex items-center rounded-t-2xl"
    >
      <div class="flex space-x-5">
        <button
          class="shrink-0 w-5 h-5 group"
          id="decrease-font"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            class="group-hover:stroke-gray-900 stroke-neutral-500 transition duration-500 ease-out"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
        <button
          class="shrink-0 w-5 h-5 group"
          id="increase-font"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            class="group-hover:stroke-gray-900 stroke-neutral-500 transition duration-500 ease-out"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>

        <button
          class="shrink-0 w-5 h-5 group"
          id="refresh"
        >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
         class="group-hover:stroke-gray-900 stroke-neutral-500 transition duration-500 ease-out" fill="none"  stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      </div>
      <div class="grow"></div>
      <button
        id="close"
        class="shrink-0 flex justify-center items-center group rounded-full relative w-[15px] h-[15px]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="3.5"
          stroke="currentColor"
          class="w-5 h-5 mix-blend-normal transition ease-in-out duration-300 group-hover:stroke-gray-500"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    <div
      id="summary"
      class="transition grow text-lg px-6 mt-3 mb-6 font-medium font-sans overflow-y-auto custom-scrollbar"
    > 
  </div>
    <div
      id="resizer"
      class="bottom-0 right-0 cursor-nwse-resize rounded-br-2xl w-3 h-3 absolute bg-gray-600 opacity-40 "
    ></div>
  </div>

  <!-- Toast -->
  <div
    id="toast-wrapper"
    class="opacity-0 transition ease-in-out duration-600"
  ></div>
`;

// ======================================================================
// Isolate the overlay and inject it into the page
// Isolation is necessary because we don't want the overlay to be affected by the page's styles
// ======================================================================
const wrapper = document.createElement("div");
wrapper.setAttribute("id", "overlay-wrapper");
const sr: ShadowRoot = wrapper.attachShadow({ mode: "open" });
sr.innerHTML = htmlData;
document.body.appendChild(wrapper);

// Inject @font-face into the current page.
// This is necessary because there's a chrome bug that prevents @font-face rules from being specified in shadow dom
const fontsStyleSheet = document.createElement("style");
document.head.appendChild(fontsStyleSheet);
fontsStyleSheet.sheet.insertRule(fontsCSS, 0);

// ======================================================================
// Make the overlay interactive
// ======================================================================
const overlay = sr.getElementById("overlay");
const handle = sr.getElementById("handle");
const close = sr.getElementById("close");
const resizer = sr.getElementById("resizer");
const decreaseFont = sr.getElementById("decrease-font");
const increaseFont = sr.getElementById("increase-font");
const refresh = sr.getElementById("refresh");
const summary = sr.getElementById("summary");

close.addEventListener("click", getCloseHandler(overlay));
handle.addEventListener("mousedown", getHandleHandler(overlay));
resizer.addEventListener("mousedown", getResizerHandler(overlay));

const MIN_FONT_SIZE = 13;
const MAX_FONT_SIZE = 22;
decreaseFont.addEventListener("click", () => {
  const currSize = parseInt(
    document.defaultView.getComputedStyle(summary).fontSize,
    10
  );

  const newSize = Math.max(currSize - 1, MIN_FONT_SIZE);
  summary.style.fontSize = `${newSize}px`;
});
increaseFont.addEventListener("click", () => {
  const currSize = parseInt(
    document.defaultView.getComputedStyle(summary).fontSize,
    10
  );

  const newSize = Math.min(currSize + 1, MAX_FONT_SIZE);
  summary.style.fontSize = `${newSize}px`;
});

// ======================================================================
// Summarize and display result
// ======================================================================
let loadingDots = null;
const loadingDotsHTML = html`
  <div class="select-none flex flex-row" id="loading-dots">
    <div></div>
    <div></div>
    <div></div>
  </div>
`;
loadingDots = document.createElement("div");
loadingDots.innerHTML = loadingDotsHTML;
summary.appendChild(loadingDots);

chrome.runtime.onConnect.addListener((port) => {
  var clone = document.cloneNode(true) as Document;
  var parsed = new Readability(clone).parse();
  let prevLen = 0;
  let generating = false;
  let portOpen = true;
  let collateTimeout: number | null = null;

  function resetSummary() {
    while (summary.firstChild) {
      summary.removeChild(summary.firstChild);
    }
    summary.textContent = "";
    loadingDots = document.createElement("div");
    loadingDots.innerHTML = loadingDotsHTML;
    summary.appendChild(loadingDots);
    prevLen = 0;
  }

  port.onDisconnect.addListener(() => {
    portOpen = false;
  });

  refresh.addEventListener("click", () => {
    // check if the port is active, if not, reestablish the connection
    if (!generating) {
      if (collateTimeout) {
        clearTimeout(collateTimeout);
      }

      if (!portOpen) {
        resetSummary();
        chrome.runtime.sendMessage({ action: "reconnect" });
        return;
      }
      resetSummary();
      port.postMessage({ kind: "summary", value: parsed.textContent });
    }
  });

  /**
   * Split a string into a list of words separated by spaces.
   * Append each words to the summary div as a span.
   * This is so that each word plays a fade in animation
   */
  function appendWords(str: string): void {
    const words = str.split(/(\s+)/);

    for (const w of words) {
      const span = document.createElement("span");
      span.classList.add("word");
      span.textContent = w;
      summary.appendChild(span);
    }
  }

  /**
   * Combine all spans in #summary into a single string and append it to #summary.
   */
  function collateSpans(): void {
    const spans = summary.querySelectorAll(".word");
    const text = Array.from(spans)
      .map((span) => span.textContent)
      .join("");
    summary.textContent = text;
  }

  port.onMessage.addListener((res: StreamingResult) => {
    switch (res.kind) {
      case "chunk":
        generating = true;
        const newText = res.value.slice(prevLen);
        prevLen = res.value.length;
        appendWords(newText);
        break;
      case "err":
        const toastWrapper = sr.getElementById("toast-wrapper");
        const toastHTML = html`
          <div
            class="fixed cursor-pointer right-0 top-0 mt-8 mr-8 p-2 bg-red-200 text-gray-800 rounded z-[10000]"
          >
            <p class="font-bold mb-2">
              Something Went Wrong.<br />${res.error.message || ""}
            </p>
            <p class="text-sm"></p>
          </div>
        `;
        createToast(toastHTML, toastWrapper);
        generating = false;
        break;
      case "done":
        generating = false;
        collateTimeout = setTimeout(() => {
          collateSpans();
        }, 2000);
        break;
      default:
        throw new Error("Invalid Streaming Response Kind");
    }
    if (generating) {
      loadingDots.remove();
    }
  });

  port.postMessage({ kind: "summary", value: parsed.textContent });
});
