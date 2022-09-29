abstract class PageAnalyzer {
  static darkPatternClass = "highlight-dark-pattern";
  static darkPatternHighlightClass = "highlight-dark-pattern-highlighted";
  static bodyDimmedClass = "highlight-body-dark-patterns-highlighted";
  static bodyClass = "highlight-body-dark-patterns";
  abstract type: string;
  abstract analyzePageContent(pageContent: HTMLElement): HTMLElement[];
  alterBlock(element: HTMLElement) {
    element.classList.add(PageAnalyzer.darkPatternClass);
    element.classList.add(`${PageAnalyzer.darkPatternClass}-${this.type}`);
  }
  getType(): string {
    return this.type;
  }
}

export default PageAnalyzer;
