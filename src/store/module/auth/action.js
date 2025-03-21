import axios from "axios";
import {
  LOADING_SPINNER_SHOW_MUTATION,
  LOGIN_ACTION,
  SET_USER_TOKEN_DATA_MUTATION,
  SIGNUP_ACTION,
} from "./storecontant";
import SignupValidations from "../../../services/signupValidations";

export default {
  async [LOGIN_ACTION](context, payload) {
    console.log("context", context);
    let postData = {
      email: payload.email,
      password: payload.password,
      returnSecureToken: true,
    };
    let res = "";
    // context.commit(LOADING_SPINNER_SHOW_MUTATION, true, { root: true });
    try {
      res = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD-k4UXhvzWX67qLrg1eJjwUQEW03Noy4o`,
        postData
      );
    } catch (err) {
      // console.log(err.response.data.error.errors[0].message);
      let messageError = SignupValidations.getErrorMessageFromCode(
        console.log(err.response),
        err.response.data.error.errors[0].message
      );
      throw messageError;
    }
    console.log("res---->", res);
    // context.commit(LOADING_SPINNER_SHOW_MUTATION, false, { root: true });
    if (res.status === 200) {
      console.log("res", res);
      context.commit(SET_USER_TOKEN_DATA_MUTATION, {
        token: res.data.idToken,
        email: res.data.email,
        userId: res.data.localId,
        refreshToken: res.data.refreshToken,
        expiresIn: res.data.expiresIn,
      });
    }
  },

  async [SIGNUP_ACTION](context, payload) {
    let postData = {
      email: payload.email,
      password: payload.password,
      returnSecureToken: true,
    };
    let res = "";
    // context.commit(LOADING_SPINNER_SHOW_MUTATION, true, { root: true });
    try {
      res = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD-k4UXhvzWX67qLrg1eJjwUQEW03Noy4o`,
        postData
      );
    } catch (err) {
      context.commit(LOADING_SPINNER_SHOW_MUTATION, false, { root: true });
      // console.log(err.response.data.error.errors[0].message);
      let messageError = SignupValidations.getErrorMessageFromCode(
        err.response.data.error.errors[0].message
      );
      throw messageError;
    }
    // context.commit(LOADING_SPINNER_SHOW_MUTATION, false, { root: true });
    if (res.status === 200) {
      context.commit(SET_USER_TOKEN_DATA_MUTATION, {
        token: res.data.idToken,
        email: res.data.email,
        userId: res.data.localId,
        refreshToken: res.data.refreshToken,
        expiresIn: res.data.expiresIn,
      });
    }
  },
};
