import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/styles/app.css";

window.addEventListener("contextmenu", (e) => e.preventDefault(), false);
createApp(App).use(router).mount("#app");
