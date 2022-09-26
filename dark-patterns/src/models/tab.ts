import FoundDarkPattern from "@/models/found-dark-pattern";

export default class Tab {
  tabId: number;
  detectedPatterns: FoundDarkPattern[] = [];

  constructor(tabId: number) {
    this.tabId = tabId;
  }

  getTabId(): number {
    return this.tabId;
  }

  setDetectedPatterns(detectedPatterns: FoundDarkPattern[]) {
    this.detectedPatterns = detectedPatterns;
  }

  getDetectedPatterns(): FoundDarkPattern[] {
    return this.detectedPatterns;
  }

  static constructFromDict(dict: {
    tabId: number;
    detectedPatterns: FoundDarkPattern[];
  }) {
    const tab = new Tab(dict.tabId);
    tab.setDetectedPatterns(dict.detectedPatterns);
    return tab;
  }
}
