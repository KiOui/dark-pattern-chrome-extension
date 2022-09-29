import PageAnalyzer from "../page-analyzer";

/*
https://intellywp.com/evergreen-countdown-timer/
 */
class EvergreenAnalyzer extends PageAnalyzer {
  type = "countdown-timer-evergreen-countdown-timer";

  analyzePageContent(pageContent: HTMLElement): HTMLElement[] {
    const foundElements =
      pageContent.querySelectorAll<HTMLElement>(".icp-countdown");
    if (foundElements === null) {
      return [];
    } else {
      return Array.from(foundElements);
    }
  }
}

export default EvergreenAnalyzer;
