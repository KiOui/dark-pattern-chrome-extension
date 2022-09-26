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
          v-if="darkPatternsFoundAmount === 0"
          class="found-dark-patterns badge bg-success"
          >{{ darkPatternsFoundAmount }}</span
        >
        <span v-else class="found-dark-patterns badge bg-danger">{{
          darkPatternsFoundAmount
        }}</span>
      </div>
      <hr />
      <template v-for="key in Object.keys(darkPatternsFound)">
        <ExplanationSection
          v-bind:title="'Title'"
          v-bind:explanation="'Explanation'"
          v-bind:goal="'Goal'"
        />
      </template>
    </div>
    <footer class="footer d-flex p-3 flex-row">
      <button class="btn btn-success w-100" @click="getTabId()">
        Show patterns
      </button>
    </footer>
  </div>
</template>

<script lang="ts">
import ExplanationSection from "@/components/ExplanationSection.vue";
import { Options, Vue } from "vue-class-component";
import { extractPatternAmount } from "@/inc/services";
import Tab from "@/models/tab";

@Options({
  components: {
    ExplanationSection,
  },
})
export default class HighlightPopup extends Vue {
  darkPatternsFound: { [key: string]: HTMLElement[] } = {};

  get darkPatternsFoundAmount() {
    return extractPatternAmount(this.darkPatternsFound);
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
        (result: { [key: string]: HTMLElement[] }) => {
          this.darkPatternsFound = result;
        }
      );
    }
  }

  onTabInformationUpdate(tab: Tab) {
    this.darkPatternsFound = tab.getDetectedPatterns();
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
