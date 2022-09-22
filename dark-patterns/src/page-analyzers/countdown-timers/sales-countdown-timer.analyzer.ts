import PageAnalyzer from "../page-analyzer";

/*
https://wordpress.org/plugins/sales-countdown-timer/
 */
class SalesCountdownTimerAnalyzer extends PageAnalyzer {
  type = "sales-countdown-timer-countdown-timer";

  alterBlock(element: HTMLElement): void {}

  analyzePageContent(pageContent: HTMLElement): HTMLElement[] {
    const foundElements = pageContent.querySelectorAll<HTMLElement>(
      ".woo-sctr-shortcode-countdown-timer-wrap"
    );
    if (foundElements === null) {
      return [];
    } else {
      return Array.from(foundElements);
    }
  }
}

export default SalesCountdownTimerAnalyzer;
