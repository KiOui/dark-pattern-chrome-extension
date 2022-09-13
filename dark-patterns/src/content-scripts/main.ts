import { createApp } from "vue";
import App from "./App.vue";

window.onload = async () => {
  const el = document.querySelector("body");
  if (el) {
    el.insertAdjacentHTML("afterend", '<div id="app">hello</div>');
    const app = createApp(App);
    app.mount("#app");
  }
};
