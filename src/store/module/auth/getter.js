import { GET_USER_TOKEN_GETTER, IS_USER_AUTHENTICATE_GETTER } from "./storecontant";

export default {
  [GET_USER_TOKEN_GETTER]: (stage) => {
    return stage.token;
  },
  [IS_USER_AUTHENTICATE_GETTER]:(stage) => {
    return !!stage.token;
  }
};
