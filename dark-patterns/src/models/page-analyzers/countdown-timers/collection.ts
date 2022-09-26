import UltimateAddonsForElementorAnalyzer from "./ultimate-addons-for-elementor.analyzer";
import PageAnalyzer from "../page-analyzer";
import HurrytimerAnalyzer from "./hurrytimer.analyzer";
import CountdownTimerUltimateAnalyzer from "./countdown-timer-ultimate.analyzer";
import SalesCountdownTimerAnalyzer from "./sales-countdown-timer.analyzer";
import EvergreenAnalyzer from "@/models/page-analyzers/countdown-timers/evergreen.analyzer";
import POWRAnalyzer from "@/models/page-analyzers/countdown-timers/powr.analyzer";

const CountdownTimerAnalyzersCollection: PageAnalyzer[] = [
  new UltimateAddonsForElementorAnalyzer(),
  new EvergreenAnalyzer(),
  new POWRAnalyzer(),
  new HurrytimerAnalyzer(),
  new CountdownTimerUltimateAnalyzer(),
  new SalesCountdownTimerAnalyzer(),
];

export default CountdownTimerAnalyzersCollection;
