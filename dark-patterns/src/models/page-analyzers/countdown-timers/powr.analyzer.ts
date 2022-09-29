import PageAnalyzer from "../page-analyzer";

/*
https://powr.io/
 */
class POWRAnalyzer extends PageAnalyzer {
  type = "powr-countdown-timer";

  analyzePageContent(pageContent: HTMLElement): HTMLElement[] {
    const foundElements =
      pageContent.querySelectorAll<HTMLElement>(".countdownTimer");
    if (foundElements === null) {
      return [];
    } else {
      return Array.from(foundElements);
    }
  }
}

export default POWRAnalyzer;
