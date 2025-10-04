import { createRouter, createWebHistory } from "vue-router";
import Login from "./pages/login.vue";
import Signup from "./pages/signup.vue";
import Post from "./components/post.vue";
//import Home from "./components/home.vue"
import QlDauSach from "./components/ql-dau-sach.vue";
import qlMuonTra from "./components/ql-muon-tra.vue";
import qlNguoiDoc from "./components/ql-nguoi-doc.vue";
import taiLieu from "./components/tai-lieu-cho-snh-vien.vue";
import store from "./store/store";
import { IS_USER_AUTHENTICATE_GETTER, CHECK_ADMIN } from "./store/module/auth/storecontant";

const routes = [
  { path: "", component: Login },
  { path: "/login", component: Login, meta: { auth: false } },
  { path: "/signup", component: Signup, meta: { auth: false } },
  { path: "/posts", component: Post, meta: { auth: true } },
  { path: "/books", component: taiLieu, meta: { auth: true } },
  { path: "/ql-dau-sach", component: QlDauSach, meta: { auth: true } },
  { path: "/ql-muon-tra", component: qlMuonTra, meta: { auth: true } },
  { path: "/ql-nguoi-doc", component: qlNguoiDoc, meta: { auth: true } },
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
    if(store.getters[`auth/${CHECK_ADMIN}`]){
      next("/ql-dau-sach");
    }else{
      next("/posts");
    }
  } else {
    next();
  }
})

export default router;
