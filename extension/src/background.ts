import cfg from "../config";

export type StreamingResult =
  | { kind: "chunk"; value: string }
  | { kind: "err"; error: Error }
  | { kind: "done" };

// ======================================================================
// On install
// ======================================================================
chrome.runtime.onInstalled.addListener((details) => {
  const reason = details.reason;

  if (reason === "install") {
    console.log("This is a first install!");
    chrome.tabs.create({ url: cfg.feBaseURL + "/welcome/installed" });
  }
});

// ======================================================================
// On extension icon click
// ======================================================================
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Try to send a message to the content script on the tab
    // This is to check if the overlay is already injected
    await chrome.tabs.sendMessage(tab.id, { action: "showOverlay" });
  } catch (e) {
    // If there's an error, the overlay is not injected
    // Inject the overlay
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["./overlay/overlay.js"],
    });

    let port = chrome.tabs.connect(tab.id);
    // Summarization request
    port.onMessage.addListener(async (res) => {
      if (res.kind === "summary") {
        streamSummary(port, res.value);
      }
    });
  }
  return true;
});

chrome.runtime.onMessage.addListener((req, sender, _sendResponse) => {
  if (req.action !== "reconnect") {
    return;
  }

  const tab = sender.tab;
  let port = chrome.tabs.connect(tab.id);

  // Summarization request
  port.onMessage.addListener(async (res) => {
    if (res.kind === "summary") {
      streamSummary(port, res.value);
    }
  });
});

/**
 * Summarize and stream the result back to the content script as it's being generated
 */
async function streamSummary(port: chrome.runtime.Port, text: string) {
  const res = await fetch("http://localhost:4000/summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    port.postMessage({
      kind: "err",
      error: new Error("Failed to fetch summary."),
    });
  }

  // Read the streaming response
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      port.postMessage({ kind: "done" });
      break;
    }
    const chunk = decoder.decode(value, { stream: true });
    port.postMessage({ kind: "chunk", value: chunk });
  }
  return true;
}
