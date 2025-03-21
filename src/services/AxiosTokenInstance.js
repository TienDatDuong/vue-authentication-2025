import axios from "axios";
import store from "../store/store";
import { GET_USER_TOKEN_GETTER } from "../store/module/auth/storecontant";

const AxiosTokenInstance = axios.create({});

AxiosTokenInstance.interceptors.request.use((confirm) => {
  let params = new URLSearchParams();
  token = store.getter[`auth/${GET_USER_TOKEN_GETTER}`];
  params.append("auth", token);
  confirm.params = params;
  return confirm;
});

export default AxiosTokenInstance;
