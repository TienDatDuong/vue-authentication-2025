import axios from "axios";
import {
  AUTH_ACTION,
  AUTH_LOGIN_ACTION,
  AUTH_LOGOUT_ACTION,
  LOADING_SPINNER_SHOW_MUTATION,
  LOGIN_ACTION,
  LOGOUT_ACTION,
  SET_USER_TOKEN_DATA_MUTATION,
  SIGNUP_ACTION,
} from "./storecontant";
import SignupValidations from "../../../services/signupValidations";

let timer = '';

export default {
  [LOGOUT_ACTION](context) {
    context.commit(SET_USER_TOKEN_DATA_MUTATION, {
      token: null,
      email: null,
      userId: null,
      refreshToken: null,
      expiresIn: null,
    });
    localStorage.removeItem('userData');
    if(timer){
      clearTimeout(timer)
    }
  },

  [AUTH_LOGOUT_ACTION](context){
    context.dispatch(LOGOUT_ACTION);
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
    let userDataString = localStorage.getItem('userData');
    if(userDataString){
      let userData = JSON.parse(userDataString);
      let expirationTime = userData.expiresIn - new Date().getTime();
      console.log("expirationTime", expirationTime);
      if (expirationTime < 10000) {
        //do can get the token with refreshToken
        //do the autoLogout
        context.dispatch(AUTH_LOGOUT_ACTION);
      } else {
        setTimeout(() => {
          context.dispatch(AUTH_LOGOUT_ACTION);
        }, expirationTime);
      }
      context.commit(SET_USER_TOKEN_DATA_MUTATION, userData);
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
      let expirationTime = +10 * 1000;

      timer = setTimeout(() => {
        context.dispatch(AUTH_LOGOUT_ACTION)
      }, expirationTime);

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
