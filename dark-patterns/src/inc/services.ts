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

function extractPatternAmount(detectedPatterns: {
  [key: string]: HTMLElement[];
}): number {
  return Object.keys(detectedPatterns)
    .map((patternKey: string) => {
      return detectedPatterns[patternKey].length;
    })
    .reduce((previousValue: number, currentValue: number) => {
      return previousValue + currentValue;
    }, 0);
}

export { setBadge, extractPatternAmount };
