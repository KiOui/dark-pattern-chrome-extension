import FoundDarkPattern from "@/models/found-dark-pattern";
import DarkPatternsCollection from "@/models/dark-patterns/dark-patterns-collection";
import DarkPattern from "@/models/dark-patterns/dark-pattern";
import PageAnalyzer from "@/models/page-analyzers/page-analyzer";
import iFrameContent from "@/inc/iframes";

const MINIMUM_TIME_BETWEEN_RUNS = 5000;
let tabId: number | null = null;
let lastRun: number | null = null;

chrome.runtime.sendMessage({ type: "get_tab_id" }, (responseTabId) => {
  if (responseTabId !== null) {
    tabId = responseTabId;
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "add_highlight_dark_patterns") {
    addHighlightCSS();
  } else if (message.type == "remove_highlight_dark_patterns") {
    removeHighlightCss();
  } else if (message.type == "add_iframe_content") {
    iFrameContent.addIFrameContent(message.referrer, message.content);
  }
});

const doRun = () => {
  if (lastRun !== null && Date.now() <= lastRun + MINIMUM_TIME_BETWEEN_RUNS) {
    return;
  }

  lastRun = Date.now();
  const content = document.querySelector("body");
  if (content !== null) {
    chrome.storage.sync.get(["highlightSettings"]).then((settings) => {
      settings = settings["highlightSettings"];
      const darkPatternsCollection = new DarkPatternsCollection();
      const darkPatterns = darkPatternsCollection.getDarkPatterns();
      const enabledDarkPatterns: DarkPattern[] = [];
      for (let i = 0; i < darkPatterns.length; i++) {
        if (settings[`analyze_${darkPatterns[i].type}`] !== false) {
          enabledDarkPatterns.push(darkPatterns[i]);
        }
      }
      const detectedPatterns = analysePageContent(content, enabledDarkPatterns);
      alterPageContent(detectedPatterns, darkPatternsCollection);
      chrome.runtime.sendMessage({
        type: "set_detected_patterns",
        tabId: tabId,
        patterns: detectedPatterns,
      });
    });
  }
  window.setTimeout(doRun, 5000);
};

function analysePageContent(
  pageContent: HTMLElement,
  darkPatterns: DarkPattern[]
): FoundDarkPattern[] {
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

  return detectedPatterns;
}

function addBlurDiv(): HTMLElement {
  const blurDiv = document.createElement("div");
  blurDiv.id = "highlight-blur-page";
  blurDiv.classList.add("highlight-blur-page");
  document.body.appendChild(blurDiv);
  return blurDiv;
}

function alterPageContent(
  detectedPatterns: FoundDarkPattern[],
  darkPatterns: DarkPatternsCollection
) {
  document.body.classList.add(PageAnalyzer.bodyClass);
  const blur = document.getElementById("highlight-blur-page");
  if (blur === null) {
    addBlurDiv();
  }
  for (let i = 0; i < detectedPatterns.length; i++) {
    const analyzer = darkPatterns.getPageAnalyzer(
      detectedPatterns[i].analyzerType
    );
    if (analyzer !== null) {
      analyzer.alterBlock(detectedPatterns[i].element);
    }
  }
}

function addHighlightCSS() {
  let blur = document.getElementById("highlight-blur-page");
  if (blur === null) {
    blur = addBlurDiv();
  }
  blur.classList.add("highlight-blur-page-enabled");
  document.body.classList.add(PageAnalyzer.bodyDimmedClass);
  const darkPatternsDetected = document.getElementsByClassName(
    PageAnalyzer.darkPatternClass
  );
  for (let i = 0; i < darkPatternsDetected.length; i++) {
    darkPatternsDetected[i].classList.add(
      PageAnalyzer.darkPatternHighlightClass
    );
  }
}

function removeHighlightCss() {
  const blur = document.getElementById("highlight-blur-page");
  if (blur !== null) {
    blur.classList.remove("highlight-blur-page-enabled");
  }
  document.body.classList.remove(PageAnalyzer.bodyDimmedClass);
  const darkPatternsDetected = document.getElementsByClassName(
    PageAnalyzer.darkPatternClass
  );
  for (let i = 0; i < darkPatternsDetected.length; i++) {
    darkPatternsDetected[i].classList.remove(
      PageAnalyzer.darkPatternHighlightClass
    );
  }
}

window.addEventListener("load", async () => {
  const config = { attributes: false, childList: true, subtree: true };
  const observer = new MutationObserver(doRun);
  observer.observe(document.body, config);
  window.setTimeout(doRun, 5000);
});
