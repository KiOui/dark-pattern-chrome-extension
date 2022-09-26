import CountdownTimer from "@/models/dark-patterns/countdown-timer";
import DarkPattern from "@/models/dark-patterns/dark-pattern";
import PageAnalyzer from "@/models/page-analyzers/page-analyzer";

class DarkPatternsCollection {
  darkPatterns: DarkPattern[] = [new CountdownTimer()];

  getDarkPatterns() {
    return this.darkPatterns;
  }

  getPageAnalyzer(type: string): PageAnalyzer | null {
    for (let i = 0; i < this.darkPatterns.length; i++) {
      const pageAnalyzer = this.darkPatterns[i].getPageAnalyzer(type);
      if (pageAnalyzer !== null) {
        return pageAnalyzer;
      }
    }
    return null;
  }

  getDarkPattern(type: string): DarkPattern | null {
    for (let i = 0; i < this.darkPatterns.length; i++) {
      if (this.darkPatterns[i].getType() === type) {
        return this.darkPatterns[i];
      }
    }
    return null;
  }
}

export default DarkPatternsCollection;
