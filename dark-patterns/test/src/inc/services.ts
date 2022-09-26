async function getTabId(): Promise<number | null> {
  return await chrome.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => {
      if (tabs.length > 0) {
        if (tabs[0].id !== undefined) {
          return tabs[0].id;
        }
      }
      return null;
    });
}

async function setBadge(
  text: string,
  backgroundColor: string,
  tabId: number | null
): Promise<boolean> {
  let setBackgroundColor: Promise<void> | null;
  let setText: Promise<void> | null;
  if (tabId !== null) {
    setBackgroundColor = chrome.action.setBadgeBackgroundColor({
      color: backgroundColor,
      tabId: tabId,
    });
    setText = chrome.action.setBadgeText({
      text: text,
      tabId: tabId,
    });
  } else {
    setBackgroundColor = chrome.action.setBadgeBackgroundColor({
      color: backgroundColor,
    });
    setText = chrome.action.setBadgeText({ text: text });
  }
  return Promise.all([setBackgroundColor, setText])
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}

export { getTabId, setBadge };
