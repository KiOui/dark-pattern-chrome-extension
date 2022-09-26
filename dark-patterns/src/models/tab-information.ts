import Tab from "@/models/tab";

export default class TabInformation {
  tabs: { [tabId: number]: Tab } = {};

  addTab(tabId: number): Tab {
    if (this.tabs[tabId] === undefined) {
      this.tabs[tabId] = new Tab(tabId);
    }
    return this.tabs[tabId];
  }

  getTab(tabId: number): Tab | null {
    if (this.tabs[tabId] === undefined) {
      return null;
    }
    return this.tabs[tabId];
  }

  removeTab(tabId: number) {
    if (this.tabs[tabId] !== undefined) {
      delete this.tabs[tabId];
    }
  }
}
