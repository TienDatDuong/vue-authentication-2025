import auth from "./module/auth/index";

import { createStore } from "vuex";

const Store = createStore({
  modules: {
    auth,
  },
});

export default Store;
