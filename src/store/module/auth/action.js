import axios from "axios";
import {
  AUTH_ACTION,
  AUTH_LOGIN_ACTION,
  LOADING_SPINNER_SHOW_MUTATION,
  LOGIN_ACTION,
  LOGOUT_ACTION,
  SET_USER_TOKEN_DATA_MUTATION,
  SIGNUP_ACTION,
} from "./storecontant";
import SignupValidations from "../../../services/signupValidations";

export default {
  [LOGOUT_ACTION](context) {
    context.commit(SET_USER_TOKEN_DATA_MUTATION, {
      token: null,
      email: null,
      userId: null,
      refreshToken: null,
      expiresIn: null,
    });
  },

  async [LOGIN_ACTION](context, payload) {
    return context.dispatch(AUTH_ACTION, {
      ...payload,
      url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD-k4UXhvzWX67qLrg1eJjwUQEW03Noy4o`,
    });
  },

  async [SIGNUP_ACTION](context, payload) {
    return context.dispatch(AUTH_ACTION, {
      ...payload,
      url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD-k4UXhvzWX67qLrg1eJjwUQEW03Noy4o`,
    });
  },

  [AUTH_LOGIN_ACTION](context,payload){
    let userData = localStorage.getItem("userData");
    if(userData){
      context.commit(SET_USER_TOKEN_DATA_MUTATION,JSON.parse(userData))
    }
  },

  async [AUTH_ACTION](context,payload){
    let postData = {
      email: payload.email,
      password: payload.password,
      returnSecureToken: true,
    };
    let res = "";
    // context.commit(LOADING_SPINNER_SHOW_MUTATION, true, { root: true });
    try {
      res = await axios.post(
        payload.url,
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
      let tokenData = {
        token: res.data.idToken,
        email: res.data.email,
        userId: res.data.localId,
        refreshToken: res.data.refreshToken,
        expiresIn: res.data.expiresIn,
      };
      localStorage.setItem('userData', JSON.stringify(tokenData))
      context.commit(SET_USER_TOKEN_DATA_MUTATION, tokenData);
    }
  }
};
