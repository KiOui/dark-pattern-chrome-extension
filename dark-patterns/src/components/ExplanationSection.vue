<template>
  <div class="explanation-section">
    <div class="header d-flex mb-2">
      <h2 class="mb-0 me-auto">{{ explanation.title }}</h2>
      <font-awesome-icon v-if="collapsed" icon="fa-solid fa-caret-down" class="caret-icon" @click="toggleCollapse(false)" />
      <font-awesome-icon v-else icon="fa-solid fa-caret-up" class="caret-icon" @click="toggleCollapse(true)" />
    </div>
    <div class="content" v-bind:style="{ 'max-height': collapsed ? 0 : getExplanationHeight() }" ref="explanation">
      <p class="mb-1"><i>What it is: </i> {{ explanation.explanation }}</p>
      <p class="mb-1"><i>Potential goal: </i>{{ explanation.goal }}</p>
    </div>
  </div>
</template>

<script>
import Explanation from "@/models/explanation.ts";

export default {
  name: "ExplanationSection",
  props: {
    explanation: Explanation,
  },
  data() {
    return {
      collapsed: true,
    }
  },
  methods: {
    toggleCollapse: function(collapsed) {
      this.collapsed = collapsed;
    },
    getExplanationHeight() {
      return `${this.$refs.explanation.scrollHeight}px`;
    }
  }
};
</script>

<style scoped>
.header h2 {
  font-weight: unset;
  font-size: 0.8rem;
}

.content {
  overflow: hidden;
  transition: max-height 200ms ease-in-out;
}

.caret-icon {
  cursor: pointer;
}
</style>