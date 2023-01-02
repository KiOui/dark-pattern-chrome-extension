import PageAnalyzer from "../page-analyzer";
import getStopWords from "@/inc/stopwords";
import stemmer from "@/inc/porter";
import iFrameContent from "@/inc/iframes";
import {
  filterText,
  getParentsWithSelf,
  isDisplayed,
  hasStylingDifferences,
  duplicateStyles,
  hasDarkPatternClass,
} from "@/inc/services";
import {
  getAcceptButtonScore,
  getRejectButtonScore,
  getManageButtonScore,
  getAcceptButtonOccurrenceScore,
  getRejectButtonOccurrenceScore,
  getManageButtonOccurrenceScore,
} from "@/inc/button-frequencies";

abstract class Filter {
  abstract filter(toFilter: PossibleCookiePopup[]): PossibleCookiePopup[];
}

class HasParentFilter extends Filter {
  filter(toFilter: PossibleCookiePopup[]): PossibleCookiePopup[] {
    return toFilter.filter((possibleCookiePopup) => {
      return possibleCookiePopup.getParentElement() !== null;
    });
  }
}

class OnlyDisplayedFilter extends Filter {
  filter(toFilter: PossibleCookiePopup[]): PossibleCookiePopup[] {
    return toFilter.filter((popup) => {
      // Ensure that an element is being displayed.
      return isDisplayed(popup.getPossibleCookiePopup());
    });
  }
}

class WordsFoundFilter extends Filter {
  static minimumNeededPercentage = 0.3;

  filter(toFilter: PossibleCookiePopup[]): PossibleCookiePopup[] {
    return toFilter.filter((popup) => {
      if (popup.getTextContent().length === 0) {
        return false;
      }
      const percentageWords =
        popup.getCommonCookiePopupWords().length /
        popup.getFilteredTextContent().length;
      return percentageWords > WordsFoundFilter.minimumNeededPercentage;
    });
  }
}

class MinimumAmountOfWordsFilter extends Filter {
  static minimumWordsNeeded = 15;

  filter(toFilter: PossibleCookiePopup[]): PossibleCookiePopup[] {
    return toFilter.filter((popup) => {
      return (
        popup.getSplitTextContent().length >
        MinimumAmountOfWordsFilter.minimumWordsNeeded
      );
    });
  }
}

class PossibleCookiePopup {
  cookiePopupElement: HTMLElement;
  parentElement: HTMLElement | null;
  textContent: string;

  static commonCookiePopupStemmedWords = [
    "cooki",
    "use",
    "accept",
    "site",
    "data",
    "partner",
    "ad",
    "set",
    "privaci",
    "inform",
    "content",
    "polici",
    "click",
    "devic",
    "websit",
    "personalis",
    "manag",
    "consent",
    "person",
    "process",
    "store",
    "prefer",
    "reject",
    "experi",
    "may",
    "access",
    "improv",
    "time",
  ];

  constructor(cookiePopupElement: HTMLElement) {
    this.cookiePopupElement = cookiePopupElement;
    this.parentElement =
      PossibleCookiePopup._computeParentElement(cookiePopupElement);
    this.textContent =
      PossibleCookiePopup._computeInnerTextWithIFrames(cookiePopupElement);
  }

  static _computeInnerTextWithIFrames(cookiePopupElement: HTMLElement) {
    let innerText = cookiePopupElement.innerText;
    if (innerText === undefined) {
      innerText = "";
    }
    const iFrames = cookiePopupElement.querySelectorAll("iframe");
    iFrames.forEach((iframe) => {
      const content = iFrameContent.getIFrameContent(iframe.src);
      innerText = innerText + " " + content;
    });
    return innerText;
  }

  static _computeParentElement(cookiePopupElement: HTMLElement) {
    const parents = getParentsWithSelf(cookiePopupElement);
    for (
      let currentParentIndex = 0;
      currentParentIndex < parents.length;
      currentParentIndex++
    ) {
      if (
        !isNaN(
          parseInt(window.getComputedStyle(parents[currentParentIndex]).zIndex)
        )
      ) {
        return parents[currentParentIndex];
      }
    }
    return null;
  }

  getTextContent(): string {
    return this.textContent;
  }

  getSplitTextContent(): string[] {
    return filterText(this.textContent);
  }

  getFilteredTextContent(): string[] {
    return this.getSplitTextContent()
      .map((word) => {
        // Map all words to lower case.
        return word.toLowerCase();
      })
      .filter((word) => {
        // Strip stop words.
        return !getStopWords().find((item) => {
          return item === word;
        });
      })
      .map((word) => {
        // Stem words.
        return stemmer(word);
      });
  }

  getCommonCookiePopupWords(): string[] {
    return this.getFilteredTextContent().filter((word) => {
      return PossibleCookiePopup.commonCookiePopupStemmedWords.find((item) => {
        return item === word;
      });
    });
  }

  getPossibleCookiePopup() {
    return this.cookiePopupElement;
  }

  getParentElement() {
    return this.parentElement;
  }
}

class PossibleConsentButton {
  static styleProperties = [
    "background-color",
    "font-size",
    "color",
    "font-weight",
    "font-family",
    "text-decoration",
    "opacity",
    "border-radius",
    "border",
    "text-align",
    "background-image",
    "text-shadow",
    "box-shadow",
    "-webkit-box-shadow",
    "padding",
    "line-height",
  ];
  button: HTMLElement;
  acceptScore: number;
  rejectScore: number;
  manageScore: number;

  acceptOccurrenceScore: number;
  rejectOccurrenceScore: number;
  manageOccurrenceScore: number;

  constructor(
    button: HTMLElement,
    acceptScore: number,
    rejectScore: number,
    manageScore: number,
    acceptOccurrenceScore: number,
    rejectOccurrenceScore: number,
    manageOccurrenceScore: number
  ) {
    this.button = button;
    this.acceptScore = acceptScore;
    this.rejectScore = rejectScore;
    this.manageScore = manageScore;
    this.acceptOccurrenceScore = acceptOccurrenceScore;
    this.rejectOccurrenceScore = rejectOccurrenceScore;
    this.manageOccurrenceScore = manageOccurrenceScore;
  }

  static createPossibleConsentButton(
    element: HTMLElement
  ): PossibleConsentButton {
    const filteredText = filterText(element.innerText)
      .map((word) => {
        // Map all words to lower case.
        return word.toLowerCase();
      })
      .map((word) => {
        // Stem words.
        return stemmer(word);
      });
    return new PossibleConsentButton(
      element,
      getAcceptButtonScore(filteredText),
      getRejectButtonScore(filteredText),
      getManageButtonScore(filteredText),
      getAcceptButtonOccurrenceScore(filteredText),
      getRejectButtonOccurrenceScore(filteredText),
      getManageButtonOccurrenceScore(filteredText)
    );
  }

  getButton() {
    return this.button;
  }

  getAcceptScore() {
    return this.acceptScore;
  }

  getRejectScore() {
    return this.rejectScore;
  }

  getManageScore() {
    return this.manageScore;
  }

  getAcceptOccurrenceScore() {
    return this.acceptOccurrenceScore;
  }

  getRejectOccurrenceScore() {
    return this.rejectOccurrenceScore;
  }

  getManageOccurrenceScore() {
    return this.manageOccurrenceScore;
  }
}

class CookieBannerAnalyzer extends PageAnalyzer {
  type = "cookie-banner";

  filters: Filter[] = [
    new HasParentFilter(),
    new OnlyDisplayedFilter(),
    new MinimumAmountOfWordsFilter(),
    new WordsFoundFilter(),
  ];

  getLinkParent(element: HTMLElement) {
    return element.parentElement;
  }

  getPossibleConsentButtons(element: HTMLElement): PossibleConsentButton[] {
    const possibleButtons = Array.from(
      element.querySelectorAll<HTMLElement>("button")
    ).concat(Array.from(element.querySelectorAll<HTMLElement>("a")));
    const filteredButtons = possibleButtons
      .filter((element) => {
        return isDisplayed(element);
      })
      .filter((element) => {
        return element.innerText !== "" && element.innerText != null;
      })
      .filter((element) => {
        const parent = this.getLinkParent(element);
        if (parent === null) {
          return true;
        }
        const textNodes = Array.from(parent.childNodes).filter((node) => {
          return node.nodeType === Node.TEXT_NODE;
        });
        const textInParent = textNodes
          .map((node) => {
            return node.textContent;
          })
          .reduce((previousValue, currentValue) => {
            if (previousValue === null) {
              previousValue = "";
            }
            if (currentValue === null) {
              currentValue = "";
            }
            return previousValue + " " + currentValue;
          }, "");
        return textInParent !== null && filterText(textInParent).length === 0;
      });
    const buttonScores: PossibleConsentButton[] = [];

    filteredButtons.forEach((element) => {
      buttonScores.push(
        PossibleConsentButton.createPossibleConsentButton(element)
      );
    });

    return buttonScores;
  }

  getConsentButtonsPerType(possibleConsentButtons: PossibleConsentButton[]) {
    const acceptButton = possibleConsentButtons.reduce(
      (
        previousValue: PossibleConsentButton | null,
        currentValue: PossibleConsentButton | null
      ) => {
        let isPossibleAcceptPrevious = 0;
        let isPossibleAcceptCurrent = 0;
        if (previousValue !== null) {
          isPossibleAcceptPrevious =
            previousValue.getAcceptScore() *
            previousValue.getAcceptOccurrenceScore();
        }
        if (currentValue !== null) {
          isPossibleAcceptCurrent =
            currentValue.getAcceptScore() *
            currentValue.getAcceptOccurrenceScore();
        }

        if (isPossibleAcceptPrevious === 0 && isPossibleAcceptCurrent === 0) {
          return null;
        } else if (isPossibleAcceptPrevious > isPossibleAcceptCurrent) {
          return previousValue;
        } else {
          return currentValue;
        }
      },
      null
    );

    // Remove accept button from list.
    if (acceptButton !== null) {
      const indexAccept = possibleConsentButtons.indexOf(acceptButton);
      possibleConsentButtons.splice(indexAccept, 1);
    }

    const manageButton = possibleConsentButtons.reduce(
      (
        previousValue: PossibleConsentButton | null,
        currentValue: PossibleConsentButton | null
      ) => {
        let isPossibleManagePrevious = 0;
        let isPossibleManageCurrent = 0;
        if (previousValue !== null) {
          isPossibleManagePrevious =
            previousValue.getManageScore() *
            previousValue.getManageOccurrenceScore();
        }
        if (currentValue !== null) {
          isPossibleManageCurrent =
            currentValue.getManageScore() *
            currentValue.getManageOccurrenceScore();
        }

        if (isPossibleManagePrevious === 0 && isPossibleManageCurrent === 0) {
          return null;
        } else if (isPossibleManagePrevious > isPossibleManageCurrent) {
          return previousValue;
        } else {
          return currentValue;
        }
      },
      null
    );

    // Remove accept button from list.
    if (manageButton !== null) {
      const indexManage = possibleConsentButtons.indexOf(manageButton);
      possibleConsentButtons.splice(indexManage, 1);
    }

    const rejectButton = possibleConsentButtons.reduce(
      (
        previousValue: PossibleConsentButton | null,
        currentValue: PossibleConsentButton | null
      ) => {
        let isPossibleRejectPrevious = 0;
        let isPossibleRejectCurrent = 0;
        if (previousValue !== null) {
          isPossibleRejectPrevious =
            previousValue.getRejectScore() *
            previousValue.getRejectOccurrenceScore();
        }
        if (currentValue !== null) {
          isPossibleRejectCurrent =
            currentValue.getRejectScore() *
            currentValue.getRejectOccurrenceScore();
        }

        if (isPossibleRejectPrevious === 0 && isPossibleRejectCurrent === 0) {
          return null;
        } else if (isPossibleRejectPrevious > isPossibleRejectCurrent) {
          return previousValue;
        } else {
          return currentValue;
        }
      },
      null
    );

    return [acceptButton, rejectButton, manageButton];
  }

  alterBlock(element: HTMLElement) {
    super.alterBlock(element);
    const buttonScores = this.getPossibleConsentButtons(element);
    const detectedButtons = this.getConsentButtonsPerType(buttonScores);
    const detectedAcceptButton = detectedButtons[0];
    const detectedRejectButton = detectedButtons[1];
    const detectedManageButton = detectedButtons[2];
    if (detectedAcceptButton !== null && detectedRejectButton !== null) {
      if (
        hasStylingDifferences(
          detectedAcceptButton.getButton(),
          detectedRejectButton.getButton(),
          PossibleConsentButton.styleProperties
        ) &&
        !hasDarkPatternClass(detectedRejectButton.getButton())
      ) {
        duplicateStyles(
          detectedAcceptButton.getButton(),
          detectedRejectButton.getButton(),
          PossibleConsentButton.styleProperties
        );
      }
    }

    if (detectedAcceptButton !== null && detectedManageButton !== null) {
      if (
        hasStylingDifferences(
          detectedAcceptButton.getButton(),
          detectedManageButton.getButton(),
          PossibleConsentButton.styleProperties
        ) &&
        !hasDarkPatternClass(detectedManageButton.getButton())
      ) {
        duplicateStyles(
          detectedAcceptButton.getButton(),
          detectedManageButton.getButton(),
          PossibleConsentButton.styleProperties
        );
      }
    }
  }

  getPossibleCookiePopups(pageContent: HTMLElement): PossibleCookiePopup[] {
    return Array.from(pageContent.querySelectorAll<HTMLElement>("body *"))
      .filter((el: HTMLElement) => {
        return window.getComputedStyle(el).position === "fixed";
      })
      .map((el: HTMLElement) => {
        return new PossibleCookiePopup(el);
      });
  }

  analyzePageContent(pageContent: HTMLElement): HTMLElement[] {
    let possibleCookiePopups = this.getPossibleCookiePopups(pageContent);

    for (
      let filterIndex = 0;
      filterIndex < this.filters.length;
      filterIndex++
    ) {
      possibleCookiePopups =
        this.filters[filterIndex].filter(possibleCookiePopups);
    }

    if (possibleCookiePopups.length > 0) {
      possibleCookiePopups.sort((popup1, popup2) => {
        let percentagePopup1 = 0;
        if (popup1.getTextContent().length !== 0) {
          percentagePopup1 =
            popup1.getCommonCookiePopupWords().length /
            popup1.getFilteredTextContent().length;
        }

        let percentagePopup2 = 0;
        if (popup2.getTextContent().length !== 0) {
          percentagePopup2 =
            popup2.getCommonCookiePopupWords().length /
            popup2.getFilteredTextContent().length;
        }

        return percentagePopup2 - percentagePopup1;
      });
      return [possibleCookiePopups[0].getPossibleCookiePopup()];
    } else {
      return [];
    }
  }
}

export default CookieBannerAnalyzer;
