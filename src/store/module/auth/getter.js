import { GET_USER_TOKEN_GETTER } from "./storecontant";

export default {
  [GET_USER_TOKEN_GETTER]: (stage) => {
    return stage.token;
  },
};
