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
      <div class="d-flex">
        <h2 class="mb-0 me-auto">Dark patterns</h2>
        <span
          v-if="darkPatternsFound === 0"
          class="found-dark-patterns badge bg-success"
          >{{ darkPatternsFound }}</span
        >
        <span v-else class="found-dark-patterns badge bg-danger">{{
          darkPatternsFound
        }}</span>
      </div>
      <hr />
      <ExplanationSection v-bind:explanation="explanation" />
    </div>
    <footer class="footer d-flex p-3 flex-row">
      <button class="btn btn-success w-100">Show patterns</button>
    </footer>
  </div>
</template>

<script lang="ts">
import ExplanationSection from "@/components/ExplanationSection.vue";

export default {
  name: "App",
  components: {
    ExplanationSection,
  },
  data() {
    return {
      darkPatternsFound: 0,
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
