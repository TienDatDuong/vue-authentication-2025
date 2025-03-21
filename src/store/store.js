import auth from "./module/auth/index";
import { createStore } from "vuex";
import { LOADING_SPINNER_SHOW_MUTATION } from "./module/auth/storecontant";

const Store = createStore({
  modules: {
    auth,
  },
  state() {
    return {
      showLoading: false,
    };
  },
  mutations: {
    [LOADING_SPINNER_SHOW_MUTATION](state, payload) {
      state.showLoading = payload;
    },
  },
});

export default Store;
