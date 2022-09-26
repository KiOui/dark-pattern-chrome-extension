import PageAnalyzer from "../page-analyzer";

/*
https://wordpress.org/plugins/hurrytimer/
 */
class HurrytimerAnalyzer extends PageAnalyzer {
  type = "hurrytimer-countdown-timer";

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  alterBlock(element: HTMLElement): void {}

  analyzePageContent(pageContent: HTMLElement): HTMLElement[] {
    const foundElements = pageContent.querySelectorAll<HTMLElement>(
      ".hurrytimer-campaign"
    );
    if (foundElements === null) {
      return [];
    } else {
      return Array.from(foundElements);
    }
  }
}

export default HurrytimerAnalyzer;
