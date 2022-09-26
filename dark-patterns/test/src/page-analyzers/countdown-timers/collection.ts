import EvergreenAnalyzer from "./evergreen.analyzer";
import UltimateAddonsForElementorAnalyzer from "./ultimate-addons-for-elementor.analyzer";
import PageAnalyzer from "../page-analyzer";
import HurrytimerAnalyzer from "./hurrytimer.analyzer";
import POWRAnalyzer from "./powr.analyzer";
import CountdownTimerUltimateAnalyzer from "./countdown-timer-ultimate.analyzer";
import SalesCountdownTimerAnalyzer from "./sales-countdown-timer.analyzer";

const CountdownTimerAnalyzers: PageAnalyzer[] = [
  new EvergreenAnalyzer(),
  new UltimateAddonsForElementorAnalyzer(),
  new HurrytimerAnalyzer(),
  new POWRAnalyzer(),
  new CountdownTimerUltimateAnalyzer(),
  new SalesCountdownTimerAnalyzer(),
];

export default CountdownTimerAnalyzers;
