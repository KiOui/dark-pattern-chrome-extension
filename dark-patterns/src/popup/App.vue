<template>
  <div id="dark-pattern-popup">
    <header class="header p-3">
      <div class="w-100 d-flex">
        <div class="app-title me-auto">
          <h1 class="mb-0">Highlight</h1>
        </div>
        <div class="settings">
          <font-awesome-icon icon="fa-solid fa-gear" />
        </div>
      </div>
    </header>
    <div class="popup-content m-3">
      <h2>Dark patterns</h2>
      <hr />
      <ExplanationSection v-bind:explanation="explanation" />
    </div>
    <footer class="footer d-flex p-3 flex-row">
      <button class="btn btn-light w-100">Show patterns</button>
    </footer>
  </div>
</template>

<script lang="ts">
import ExplanationSection from "../components/ExplanationSection.vue";

export default {
  name: "App",
  components: {
    ExplanationSection,
  },
  data() {
    return {
      explanation: {
        title: "Countdown Timer",
        explanation: "This is a test explanation",
        goal: "To trick you",
      },
    };
  },
};
</script>

<style scoped>
.header {
  background-color: var(--background-shade);
}
</style>
