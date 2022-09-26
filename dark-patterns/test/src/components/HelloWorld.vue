<template>
  <div>
    <p>Hello World!</p>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class HelloWorld extends Vue {
  mounted() {
    browser.runtime.sendMessage({});
  }
}
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
