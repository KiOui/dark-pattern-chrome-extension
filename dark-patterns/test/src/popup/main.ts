import { createApp } from "vue";
import App from "./App.vue";
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
  faGear,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/colors.css";
import "../assets/css/base.css";

/* add icons to the library */
library.add(faGear, faCaretDown, faCaretUp);

const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon).mount("#app");
