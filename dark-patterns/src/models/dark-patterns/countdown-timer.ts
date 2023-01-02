import DarkPattern from "@/models/dark-patterns/dark-pattern";
import CountdownTimerAnalyzersCollection from "@/models/page-analyzers/countdown-timers/collection";

class CountdownTimer extends DarkPattern {
  analyzers = CountdownTimerAnalyzersCollection;
  description = "A countdown timer displaying a limited-time offer.";
  goal =
    "Countdown timers cause a sense of urgency by displaying a limited-time offer that might be fake.";
  name = "Countdown Timer";
  type = "countdown-timer";
}

export default CountdownTimer;
