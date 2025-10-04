import { CHECK_ADMIN, GET_USER_TOKEN_GETTER, IS_USER_AUTHENTICATE_GETTER, EMAIL_GETTER } from "./storecontant";

export default {
  [GET_USER_TOKEN_GETTER]: (stage) => {
    return stage.token;
  },
  [IS_USER_AUTHENTICATE_GETTER]:(stage) => {
    return !!stage.token;
  },
  [CHECK_ADMIN]: (stage) => {
    return stage.email === "admin@gmail.com";
  },
  [EMAIL_GETTER]: (stage) => {
    return stage.email;
  },
};
