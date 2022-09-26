import { createApp } from "vue";
import App from "@/options/App.vue";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/colors.css";
import "../assets/css/base.css";

const app = createApp(App);
app.mount("#app");
