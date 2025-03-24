import { createRouter, createWebHistory } from "vue-router";
import Login from "./pages/login.vue";
import Signup from "./pages/signup.vue";
import Post from "./components/Post.vue";
import Home from "./components/home.vue"
import store from "./store/store";
import { IS_USER_AUTHENTICATE_GETTER } from "./store/module/auth/storecontant";

const routes = [
  { path: "", component: Home },
  { path: "/login", component: Login, meta: { auth: false } },
  { path: "/signup", component: Signup, meta: { auth: false } },
  { path: "/posts", component: Post, meta: { auth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to,from,next)=>{
  console.log("to", to);
  if( 'auth' in to.meta && to.meta.auth && !store.getters[`auth/${IS_USER_AUTHENTICATE_GETTER}`]){
    next('/login');
  }else if (
    "auth" in to.meta &&
    !to.meta.auth &&
    store.getters[`auth/${IS_USER_AUTHENTICATE_GETTER}`]
  ) {
    next("/posts");
  } else {
    next();
  }
})

export default router;
