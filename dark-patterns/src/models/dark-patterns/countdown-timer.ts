import DarkPattern from "@/models/dark-patterns/dark-pattern";
import CountdownTimerAnalyzersCollection from "@/models/page-analyzers/countdown-timers/collection";

class CountdownTimer extends DarkPattern {
  analyzers = CountdownTimerAnalyzersCollection;
  description = "A countdown timer";
  goal = "To trick you";
  name = "Countdown Timer";
  type = "countdown-timer";
}

export default CountdownTimer;
