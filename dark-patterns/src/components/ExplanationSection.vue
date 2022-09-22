<template>
  <div class="explanation-section">
    <div class="header d-flex">
      <h2 class="mb-0 me-auto">{{ explanation.title }}</h2>
      <font-awesome-icon v-if="collapsed" icon="fa-solid fa-caret-down" @click="toggleCollapse(false)" />
      <font-awesome-icon v-else icon="fa-solid fa-caret-up" @click="toggleCollapse(true)" />
    </div>
    <div class="content">
      <p><i>What it is: </i> {{ explanation.explanation }}</p>
      <p><i>Potential goal: </i>{{ explanation.goal }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExpandableSection",
  extends: "ExpandableSection",
  props: {
    explanation: String,
  },
  data() {
    return {
      collapsed: true,
    }
  },
  methods: {
    toggleCollapse: function(collapsed) {
      this.collapsed = collapsed;
    }
  }
};
</script>

<style scoped>

</style>