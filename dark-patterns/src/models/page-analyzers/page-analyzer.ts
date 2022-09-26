abstract class PageAnalyzer {
  abstract type: string;
  abstract analyzePageContent(pageContent: HTMLElement): HTMLElement[];
  abstract alterBlock(element: HTMLElement): void;
  getType(): string {
    return this.type;
  }
}

export default PageAnalyzer;
