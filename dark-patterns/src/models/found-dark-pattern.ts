export default class FoundDarkPattern {
  darkPatternType: string;
  element: HTMLElement;
  analyzerType: string;

  constructor(
    darkPatternType: string,
    analyzerType: string,
    element: HTMLElement
  ) {
    this.darkPatternType = darkPatternType;
    this.analyzerType = analyzerType;
    this.element = element;
  }
}
