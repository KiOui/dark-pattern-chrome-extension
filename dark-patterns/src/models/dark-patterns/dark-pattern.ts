import PageAnalyzer from "@/models/page-analyzers/page-analyzer";

abstract class DarkPattern {
  abstract name: string;
  abstract type: string;
  abstract description: string;
  abstract goal: string;
  abstract analyzers: PageAnalyzer[];

  getType(): string {
    return this.type;
  }

  getAnalyzers() {
    return this.analyzers;
  }

  getPageAnalyzer(type: string): PageAnalyzer | null {
    for (let i = 0; i < this.analyzers.length; i++) {
      if (this.analyzers[i].getType() === type) {
        return this.analyzers[i];
      }
    }
    return null;
  }
}

export default DarkPattern;
