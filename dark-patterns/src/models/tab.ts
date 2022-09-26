export default class Tab {
  tabId: number;
  detectedPatterns: { [key: string]: HTMLElement[] } | null = null;

  constructor(tabId: number) {
    this.tabId = tabId;
  }

  getTabId(): number {
    return this.tabId;
  }

  setDetectedPatterns(detectedPatterns: { [key: string]: HTMLElement[] }) {
    this.detectedPatterns = detectedPatterns;
  }

  getDetectedPatterns(): { [key: string]: HTMLElement[] } {
    if (this.detectedPatterns === null) {
      return {};
    } else {
      return this.detectedPatterns;
    }
  }

  static constructFromDict(dict: {
    tabId: number;
    detectedPatterns: { [key: string]: HTMLElement[] } | null | undefined;
  }) {
    console.log(dict);
    const tab = new Tab(dict.tabId);
    if (dict.detectedPatterns !== null && dict.detectedPatterns !== undefined) {
      tab.setDetectedPatterns(dict.detectedPatterns);
    }
    return tab;
  }
}
