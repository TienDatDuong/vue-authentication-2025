import axios from "axios";
import { SIGNUP_ACTION } from "./storecontant";

export default {
  async [SIGNUP_ACTION](_, payload) {
    console.log("payload", payload);
    let postData = {
      email: payload.email,
      password: payload.password,
      returnSecureToken: true,
    };
    let res = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD-k4UXhvzWX67qLrg1eJjwUQEW03Noy4o`,
      postData
    );

    console.log("res===>", res);
  },
};
