<template>
  <div id="dark-pattern-popup">
    <header class="header p-3">
      <div class="w-100 d-flex">
        <div class="app-title me-auto">
          <h1 class="mb-0">Highlight</h1>
        </div>
        <div class="settings" @click="openOptions()">
          <font-awesome-icon icon="fa-solid fa-gear" />
        </div>
      </div>
    </header>
    <div class="popup-content m-3">
      <div class="d-flex">
        <h2 class="mb-0 me-auto">Dark patterns</h2>
        <span
          v-if="darkPatternsFound.length === 0"
          class="found-dark-patterns badge bg-success"
          >{{ darkPatternsFound.length }}</span
        >
        <span v-else class="found-dark-patterns badge bg-danger">{{
          darkPatternsFound.length
        }}</span>
      </div>
      <hr />
      <div
        :key="darkPatternFound"
        v-for="darkPatternFound in Object.keys(foundPerDarkPattern)"
      >
        <template v-if="darkPattern(darkPatternFound) !== null">
          <ExplanationSection
            v-bind:title="darkPattern(darkPatternFound).name"
            v-bind:goal="darkPattern(darkPatternFound).goal"
            v-bind:explanation="darkPattern(darkPatternFound).description"
            v-bind:amount="foundPerDarkPattern[darkPatternFound].length"
          ></ExplanationSection>
        </template>
      </div>
    </div>
    <footer class="footer d-flex p-3 flex-row justify-content-center">
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="showBadgeNumberInput"
          v-model="highlightDarkPatterns"
          @click="toggleHighlightDarkPatterns(!highlightDarkPatterns)"
        />
        <label class="form-check-label" for="showBadgeNumberInput"
          >Highlight dark patterns</label
        >
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import ExplanationSection from "@/components/ExplanationSection.vue";
import { Options, Vue } from "vue-class-component";
import Tab from "@/models/tab";
import DarkPatternsCollection from "@/models/dark-patterns/dark-patterns-collection";
import FoundDarkPattern from "@/models/found-dark-pattern";
import DarkPattern from "@/models/dark-patterns/dark-pattern";

@Options({
  components: {
    ExplanationSection,
  },
})
export default class HighlightPopup extends Vue {
  darkPatternsFound: FoundDarkPattern[] = [];
  darkPatternsCollection: DarkPatternsCollection = new DarkPatternsCollection();
  highlightDarkPatterns = false;

  darkPattern(key: string): null | DarkPattern {
    return this.darkPatternsCollection.getDarkPattern(key);
  }

  get foundPerDarkPattern(): { [key: string]: FoundDarkPattern[] } {
    const dict: { [key: string]: FoundDarkPattern[] } = {};
    for (let i = 0; i < this.darkPatternsFound.length; i++) {
      const darkPatternFound = this.darkPatternsFound[i];
      if (darkPatternFound.darkPatternType in dict) {
        dict[darkPatternFound.darkPatternType].push(darkPatternFound);
      } else {
        dict[darkPatternFound.darkPatternType] = [darkPatternFound];
      }
    }
    return dict;
  }

  getTabId(): Promise<number | null> {
    return chrome.tabs
      .query({ active: true, currentWindow: true })
      .then((result) => {
        if (result.length > 0 && result[0].id !== undefined) {
          return result[0].id;
        } else {
          return null;
        }
      });
  }

  openOptions() {
    chrome.runtime.openOptionsPage();
  }

  async getDetectedDarkPatterns() {
    const tabId = await this.getTabId();
    if (tabId !== null) {
      chrome.runtime.sendMessage(
        { type: "get_detected_patterns", tabId: tabId },
        (result: FoundDarkPattern[]) => {
          console.log(result);
          this.darkPatternsFound = result;
        }
      );
    }
  }

  onTabInformationUpdate(tab: Tab) {
    this.darkPatternsFound = tab.getDetectedPatterns();
  }

  addHighlightDarkPatterns() {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id !== undefined) {
          chrome.tabs.sendMessage(tab.id, {
            type: "add_highlight_dark_patterns",
          });
        }
      });
    });
  }

  removeHighlightDarkPatterns() {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id !== undefined) {
          chrome.tabs.sendMessage(tab.id, {
            type: "remove_highlight_dark_patterns",
          });
        }
      });
    });
  }

  toggleHighlightDarkPatterns(highlight: boolean | null) {
    if (highlight === null) {
      highlight = this.highlightDarkPatterns;
    }
    if (highlight) {
      this.addHighlightDarkPatterns();
    } else {
      this.removeHighlightDarkPatterns();
    }
  }

  mounted() {
    this.getDetectedDarkPatterns();
    chrome.runtime.onMessage.addListener(
      async (message: { type: string; tab: Tab }) => {
        const tabId = await this.getTabId();
        if (tabId !== null && message.type === "tab_information_updated") {
          const tabObj = Tab.constructFromDict(message.tab);
          if (tabObj.getTabId() === tabId) {
            this.onTabInformationUpdate(tabObj);
          }
        }
      }
    );
  }
}
</script>

<style scoped>
.header {
  background-color: var(--background-shade);
}

.settings {
  cursor: pointer;
}

.settings:hover svg {
  animation: color 200ms;
}

.settings:hover > svg {
  color: #d3d4d5;
}
</style>
