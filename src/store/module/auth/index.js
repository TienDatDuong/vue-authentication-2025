import actions from "./action";
import getters from "./getter";
import mutations from "./mutations";

export default {
  namespaced: true,
  state() {
    return {
      token: '',
      email: '',
      userId: '',
      refreshToken: '',
      expiresIn: '',
    };
  },
  mutations,
  getters,
  actions,
};
