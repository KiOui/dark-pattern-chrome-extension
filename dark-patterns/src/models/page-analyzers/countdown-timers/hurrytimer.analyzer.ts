import PageAnalyzer from "../page-analyzer";

/*
https://wordpress.org/plugins/hurrytimer/
 */
class HurrytimerAnalyzer extends PageAnalyzer {
  type = "hurrytimer-countdown-timer";

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
