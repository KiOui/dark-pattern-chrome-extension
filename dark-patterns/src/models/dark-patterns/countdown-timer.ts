import DarkPattern from "@/models/dark-patterns/dark-pattern";
import CountdownTimerAnalyzers from "@/models/page-analyzers/countdown-timers/collection";

class CountdownTimer extends DarkPattern {
  analyzers = CountdownTimerAnalyzers;
  description = "A countdown timer";
  goal = "To trick you";
  name = "Countdown Timer";
  type = "countdown-timer";
}

export default CountdownTimer;
