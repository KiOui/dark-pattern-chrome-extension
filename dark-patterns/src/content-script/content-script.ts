import FoundDarkPattern from "@/models/found-dark-pattern";
import DarkPatternsCollection from "@/models/dark-patterns/dark-patterns-collection";
import DarkPattern from "@/models/dark-patterns/dark-pattern";

const PAGE_REFRESH_TIMEOUT = 10000;
let DARK_PATTERN_TIMER: number | null;
let tabId: number | null = null;

chrome.runtime.sendMessage({ type: "get_tab_id" }, (responseTabId) => {
  if (responseTabId !== null) {
    tabId = responseTabId;
  }
});

window.onload = async () => {
  runAndSetTimeout(PAGE_REFRESH_TIMEOUT);
};

function runAndSetTimeout(timeout: number) {
  if (DARK_PATTERN_TIMER !== null) {
    window.clearTimeout(DARK_PATTERN_TIMER);
  }
  try {
    const content = document.querySelector("body");
    if (content !== null) {
      const darkPatternsCollection = new DarkPatternsCollection();
      analysePageContent(content, darkPatternsCollection.getDarkPatterns());
    }
  } finally {
    DARK_PATTERN_TIMER = window.setTimeout(
      runAndSetTimeout.bind(null, timeout),
      PAGE_REFRESH_TIMEOUT
    );
  }
}

function analysePageContent(
  pageContent: HTMLElement,
  darkPatterns: DarkPattern[]
) {
  const detectedPatterns: FoundDarkPattern[] = [];

  for (let i = 0; i < darkPatterns.length; i++) {
    const darkPattern = darkPatterns[i];
    const analyzers = darkPattern.getAnalyzers();
    for (let n = 0; n < analyzers.length; n++) {
      const analyzer = analyzers[n];
      const foundElements = analyzer.analyzePageContent(pageContent);
      for (let t = 0; t < foundElements.length; t++) {
        const foundElement = foundElements[t];
        detectedPatterns.push(
          new FoundDarkPattern(
            darkPattern.getType(),
            analyzer.getType(),
            foundElement
          )
        );
      }
    }
  }

  chrome.runtime.sendMessage({
    type: "set_detected_patterns",
    tabId: tabId,
    patterns: detectedPatterns,
  });
}
