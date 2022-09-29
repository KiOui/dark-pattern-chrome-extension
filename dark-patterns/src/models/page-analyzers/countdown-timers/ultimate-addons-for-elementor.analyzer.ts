import PageAnalyzer from "../page-analyzer";

/*
https://ultimateelementor.com/widgets/countdown-timer/
 */
class UltimateAddonsForElementorCountdownTimer extends PageAnalyzer {
  type = "ultimate-addons-for-elementor-countdown-timer";

  analyzePageContent(pageContent: HTMLElement): HTMLElement[] {
    const foundElements = pageContent.querySelectorAll<HTMLElement>(
      ".elementor-widget-uael-countdown"
    );
    if (foundElements === null) {
      return [];
    } else {
      return Array.from(foundElements);
    }
  }
}

export default UltimateAddonsForElementorCountdownTimer;
