<template>
  <div class="container mt-5" style="max-width: 800px">
    <h1>Highlight Settings</h1>
    <form v-if="loaded">
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="showBadgeNumberInput"
          v-model="formData['showBadgeNumber']"
        />
        <label class="form-check-label" for="showBadgeNumberInput"
          >Show badge number</label
        >
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

@Options({})
export default class HighlightSettings extends Vue {
  loaded = false;

  formData: { [key: string]: boolean } = {
    showBadgeNumber: true,
  };

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
