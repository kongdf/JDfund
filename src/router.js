import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Setting from "@/views/setting.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/setting",
      name: "setting",
      component: Setting,
    },
  ],
});

export default router;
