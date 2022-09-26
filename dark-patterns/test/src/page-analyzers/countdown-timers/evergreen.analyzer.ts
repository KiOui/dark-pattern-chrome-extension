import PageAnalyzer from "../page-analyzer";

/*
https://intellywp.com/evergreen-countdown-timer/
 */
class EvergreenAnalyzer extends PageAnalyzer {
  type = "evergreen-countdown-timer";

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  alterBlock(element: HTMLElement): void {}

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
