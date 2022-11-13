import PageAnalyzer from "../page-analyzer";
import getStopWords from "@/inc/stopwords";
import stemmer from "@/inc/porter";
import iFrameContent from "@/inc/iframes";

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
      const parents = getParentsWithSelf(popup.getPossibleCookiePopup());
      for (
        let currentParentIndex = 0;
        currentParentIndex < parents.length;
        currentParentIndex++
      ) {
        if (
          window
            .getComputedStyle(parents[currentParentIndex])
            .getPropertyValue("display") === "none"
        ) {
          return false;
        }
      }
      return true;
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
      console.log(popup.getSplitTextContent());
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
      console.log(iFrameContent.getIFrameContent(iframe.src));
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
    // Replace weird characters.
    const filteredText = this.textContent.replaceAll(/[^\w\s]/gm, "");
    // Split all words.
    return filteredText.split(/\s+/);
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

class CookieBannerAnalyzer extends PageAnalyzer {
  type = "cookie-banner";

  filters: Filter[] = [
    new HasParentFilter(),
    new OnlyDisplayedFilter(),
    new MinimumAmountOfWordsFilter(),
    new WordsFoundFilter(),
  ];

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
      console.log(this.filters[filterIndex]);
      console.log(possibleCookiePopups);
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
      console.log(possibleCookiePopups[0].getPossibleCookiePopup());
      return [possibleCookiePopups[0].getPossibleCookiePopup()];
    } else {
      console.log("Nothing found...");
      return [];
    }
  }
}

export default CookieBannerAnalyzer;
