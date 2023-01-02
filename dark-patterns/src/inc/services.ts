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

function hasStylingDifferences(
  element1: HTMLElement,
  element2: HTMLElement,
  compareOn: string[]
): boolean {
  const element1Styles = window.getComputedStyle(element1);
  const element2Styles = window.getComputedStyle(element2);
  for (let i = 0; i < compareOn.length; i++) {
    const styleToCompare = compareOn[i];
    const styleOfElement1 = element1Styles.getPropertyValue(styleToCompare);
    const styleOfElement2 = element2Styles.getPropertyValue(styleToCompare);
    if (styleOfElement1 !== styleOfElement2) {
      return true;
    }
  }
  return false;
}

function hasDarkPatternClass(element: HTMLElement) {
  for (let i = 0; i < element.classList.length; i++) {
    if (element.classList[i].startsWith("_dark_pattern_")) {
      return true;
    }
  }
  return false;
}

function getIDPathToRoot(element: HTMLElement): HTMLElement[] {
  const pathToRoot = [];
  for (
    let rotateElement: HTMLElement | null = element;
    rotateElement !== document.body && rotateElement !== null;
    rotateElement = rotateElement.parentElement
  ) {
    pathToRoot.push(rotateElement);
    if (rotateElement.id === "") {
      const randomId = Math.random().toString().substring(2, 9);
      const randomStyleName = `_dark_pattern_${randomId}`;
      rotateElement.id = `${randomStyleName}`;
    }
  }
  pathToRoot.reverse();
  return pathToRoot;
}

function createStringPathToRoot(pathToRoot: HTMLElement[]): string {
  let pathAsString = "";
  for (let i = 0; i < pathToRoot.length; i++) {
    let selectorToAdd = pathToRoot[i].id;
    if (!isNaN(parseInt(selectorToAdd[0], 10))) {
      selectorToAdd = `\\3${selectorToAdd[0]} ` + selectorToAdd.substring(1);
    }
    if (selectorToAdd.startsWith("#")) {
      selectorToAdd = selectorToAdd.substring(1);
    }
    pathAsString = pathAsString + "#" + selectorToAdd;
    if (i < pathToRoot.length - 1) {
      pathAsString = pathAsString + " ";
    }
  }
  return pathAsString;
}

function duplicatePseudoSelectorStyles(
  fromElement: HTMLElement,
  pseudoSelector: string,
  pathToRoot: HTMLElement[],
  stylesToCopy: string[]
) {
  const stylesFromPseudoSelector = window.getComputedStyle(
    fromElement,
    pseudoSelector
  );
  if (stylesFromPseudoSelector.getPropertyValue("content") !== "none") {
    let stylingToAdd = `html body ${createStringPathToRoot(
      pathToRoot
    )}:${pseudoSelector} {\n`;
    for (let i = 0; i < stylesToCopy.length; i++) {
      const styleToCopy = stylesToCopy[i];
      const styleToCopyValue =
        stylesFromPseudoSelector.getPropertyValue(styleToCopy);
      stylingToAdd =
        stylingToAdd + `\t${styleToCopy}: ${styleToCopyValue} !important;\n`;
    }
    stylingToAdd = stylingToAdd + "}";
    const styleSheet = document.createElement("style");
    styleSheet.innerHTML = stylingToAdd;
    document.body.appendChild(styleSheet);
  }
}

function duplicateStyles(
  fromElement: HTMLElement,
  toElement: HTMLElement,
  stylesToCopy: string[]
): string {
  const randomId = Math.random().toString().substring(2, 9);
  const randomStyleName = `_dark_pattern_${randomId}`;
  toElement.classList.add(randomStyleName);
  if (toElement.id === "") {
    toElement.id = randomStyleName;
  }

  const pathToRoot = getIDPathToRoot(toElement);

  const stylesFromElement = window.getComputedStyle(fromElement);
  let stylingToAdd = `.${randomStyleName}, html body ${createStringPathToRoot(
    pathToRoot
  )} {\n`;
  for (let i = 0; i < stylesToCopy.length; i++) {
    const styleToCopy = stylesToCopy[i];
    const styleToCopyValue = stylesFromElement.getPropertyValue(styleToCopy);
    stylingToAdd =
      stylingToAdd + `\t${styleToCopy}: ${styleToCopyValue} !important;\n`;
  }
  stylingToAdd = stylingToAdd + "}";

  const styleSheet = document.createElement("style");
  styleSheet.innerHTML = stylingToAdd;
  document.body.appendChild(styleSheet);
  duplicatePseudoSelectorStyles(
    fromElement,
    "before",
    pathToRoot,
    stylesToCopy
  );
  duplicatePseudoSelectorStyles(fromElement, "after", pathToRoot, stylesToCopy);
  return randomStyleName;
}

export {
  setBadge,
  getParentsWithSelf,
  getParents,
  isDisplayed,
  filterText,
  hasStylingDifferences,
  duplicateStyles,
  hasDarkPatternClass,
};
