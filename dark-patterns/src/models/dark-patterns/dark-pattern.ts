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
}

export default DarkPattern;
