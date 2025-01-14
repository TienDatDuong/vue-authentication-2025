import action from "./action";
import getters from "./getter";
import mutations from "./mutations";

export default {
  namespaced: true,
  state() {
    return {
      name: "dtdat13",
    };
  },
  mutations,
  getters,
  action,
};
