<template>
  <div class="container mt-5" style="max-width: 800px">
    <h1>Highlight Settings</h1>
    <form v-if="loaded">
      <div
        v-for="darkPattern in darkPatterns.getDarkPatterns()"
        :key="darkPattern"
        class="form-check form-switch"
      >
        <label class="form-check-label" for="showBadgeNumberInput"
          >Analyze {{ darkPattern.name }}</label
        >
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="showBadgeNumberInput"
          v-model="formData[`analyze_${darkPattern.name}`]"
        />
      </div>
      <input
        type="submit"
        value="Save"
        class="btn btn-success mt-2"
        @click="saveOptions()"
      />
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import DarkPatternsCollection from "@/models/dark-patterns/dark-patterns-collection";

@Options({})
export default class HighlightSettings extends Vue {
  loaded = false;
  darkPatterns = new DarkPatternsCollection();

  formData: { [key: string]: boolean } = {};

  saveOptions() {
    const formData = this.formData;
    chrome.storage.sync.set({
      highlightSettings: formData,
    });
  }

  mounted() {
    this.loadOptions();
  }

  loadOptions() {
    for (let i = 0; i < this.darkPatterns.getDarkPatterns().length; i++) {
      this.formData[`analyze_${this.darkPatterns.getDarkPatterns()[i].type}`] =
        true;
    }
    chrome.storage.sync.get(["highlightSettings"]).then((result) => {
      this.formData = Object.assign(
        {},
        this.formData,
        result["highlightSettings"]
      );
      this.loaded = true;
    });
  }
}
</script>

<style scoped></style>
