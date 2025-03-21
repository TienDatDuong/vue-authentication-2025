import { createRouter, createWebHistory } from "vue-router";
import Login from "./pages/login.vue";
import Signup from "./pages/signup.vue";
import Post from "./components/Post.vue";

const routes = [
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/posts", component: Post },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
