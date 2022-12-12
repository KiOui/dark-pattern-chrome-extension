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

function getParents(element: HTMLElement): HTMLElement[] {
  const parents: HTMLElement[] = [];
  for (
    let elementToCheck = element.parentElement;
    elementToCheck !== null;
    elementToCheck = elementToCheck.parentElement
  ) {
    parents.push(elementToCheck);
  }
  return parents;
}

function getParentsWithSelf(element: HTMLElement): HTMLElement[] {
  const parents = getParents(element);
  parents.unshift(element);
  return parents;
}

function isDisplayed(element: HTMLElement): boolean {
  if (element.tagName.toLowerCase() === "body") {
    return true;
  }

  const getComputedStyle = window.getComputedStyle(element);
  const isChildVisible =
    getComputedStyle.getPropertyValue("display") !== "none" &&
    getComputedStyle.getPropertyValue("visibility") !== "hidden" &&
    isVisibleByPosition(getComputedStyle);

  const parentNode = element.parentElement;

  let isParentVisible = true;
  if (parentNode !== null && parentNode.tagName.toLowerCase() !== "body") {
    isParentVisible = isDisplayed(parentNode);
  }
  return isChildVisible && isParentVisible;
}

function isVisibleByPosition(getComputedStyle: CSSStyleDeclaration): boolean {
  const position = getComputedStyle.getPropertyValue("position");
  const isPositioned = position === "relative" || position === "absolute";
  const top = getComputedStyle.getPropertyValue("top").replace("px", "");
  const left = getComputedStyle.getPropertyValue("left").replace("px", "");
  const zIndex = getComputedStyle.getPropertyValue("z-index");

  return !(
    isPositioned &&
    ((top.indexOf("-") === 0 && parseInt(top) < -1000) ||
      (left.indexOf("-") === 0 && parseInt(left) < -1000) ||
      zIndex.indexOf("-") === 0)
  );
}

function filterText(text: string): string[] {
  // Replace weird characters.
  const filteredText = text.replaceAll(/[^\w\s]/gm, "");
  // Split all words.
  return filteredText.split(/\s+/).filter((item) => {
    return item !== "";
  });
}

export { setBadge, getParentsWithSelf, getParents, isDisplayed, filterText };
