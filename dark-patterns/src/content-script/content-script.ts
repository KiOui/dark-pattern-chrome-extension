import CountdownTimerAnalyzers from "@/page-analyzers/countdown-timers/collection";
import PageAnalyzer from "@/page-analyzers/page-analyzer";

const PAGE_REFRESH_TIMEOUT = 10000;
let DARK_PATTERN_TIMER: number | null;

window.onload = async () => {
  const analyzers: { [name: string]: PageAnalyzer } = setupAnalyzers();
  runAndSetTimeout(analyzers, PAGE_REFRESH_TIMEOUT);
};

function runAndSetTimeout(
  analyzers: { [key: string]: PageAnalyzer },
  timeout: number
) {
  if (DARK_PATTERN_TIMER !== null) {
    window.clearTimeout(DARK_PATTERN_TIMER);
  }
  try {
    const content = document.querySelector("body");
    if (content !== null) {
      analysePageContent(content, analyzers);
    }
  } finally {
    DARK_PATTERN_TIMER = window.setTimeout(
      runAndSetTimeout.bind(null, analyzers, timeout),
      PAGE_REFRESH_TIMEOUT
    );
  }
}

function setupAnalyzers(): { [name: string]: PageAnalyzer } {
  const analyzers: PageAnalyzer[] = CountdownTimerAnalyzers;
  const analyzersDict: { [key: string]: PageAnalyzer } = {};
  for (const analyzer of analyzers) {
    analyzersDict[analyzer.getType()] = analyzer;
  }
  return analyzersDict;
}

function analysePageContent(
  pageContent: HTMLElement,
  analyzers: { [name: string]: PageAnalyzer }
) {
  const detectedPatterns: { [type: string]: HTMLElement[] } = {};
  for (const analyzerType in analyzers) {
    const analyzer = analyzers[analyzerType];
    detectedPatterns[analyzerType] = analyzer.analyzePageContent(pageContent);
  }

  for (const detectedPatternType in detectedPatterns) {
    const analyzerToUse = analyzers[detectedPatternType];
    const listOfHTMLElementsDetected: HTMLElement[] =
      detectedPatterns[detectedPatternType];
    for (const detectedPattern of listOfHTMLElementsDetected) {
      analyzerToUse.alterBlock(detectedPattern);
    }
  }

  const amountOfPatternsDetected = Object.keys(detectedPatterns)
    .map((patternKey: string) => {
      return detectedPatterns[patternKey].length;
    })
    .reduce((previousValue: number, currentValue: number) => {
      return previousValue + currentValue;
    });

  const badgeColor = amountOfPatternsDetected === 0 ? "green" : "red";

  chrome.runtime.sendMessage({
    type: "set_badge",
    params: {
      text: amountOfPatternsDetected.toString(),
      color: badgeColor,
    },
  });
}
