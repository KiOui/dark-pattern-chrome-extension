import PageAnalyzer from "../page-analyzer";

/*
https://www.essentialplugin.com/wordpress-plugin/countdown-timer-ultimate/
 */
class CountdownTimerUltimateAnalyzer extends PageAnalyzer {
  type = "countdown-timer-ultimate-countdown-timer";

  alterBlock(element: HTMLElement): void {}

  analyzePageContent(pageContent: HTMLElement): HTMLElement[] {
    const foundElements =
      pageContent.querySelectorAll<HTMLElement>(".wpcdt-timer-wrap");
    if (foundElements === null) {
      return [];
    } else {
      return Array.from(foundElements).filter((value) => {
        const dataConf = value.getAttribute("data-conf");
        if (dataConf === null) {
          return true;
        }
        try {
          const parsedConf = JSON.parse(dataConf);
          return (
            parsedConf["timer_mode"] === undefined ||
            parsedConf["timer_mode"] === "evergreen"
          );
        } catch (e) {
          return true;
        }
      });
    }
  }
}

export default CountdownTimerUltimateAnalyzer;
