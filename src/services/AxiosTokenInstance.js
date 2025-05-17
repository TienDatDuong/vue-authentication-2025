import axios from "axios";
import store from "../store/store";
import { GET_USER_TOKEN_GETTER } from "../store/module/auth/storecontant";

const AxiosTokenInstance = axios.create({});

AxiosTokenInstance.interceptors.request.use((confirm) => {
  let params = new URLSearchParams();
  // new URLSearchParams() để tạo query string ở dạng key=value&key=value
  // vd: ?key1=value1&key2=value2
  // params.append("key1", "value1");
  let token = store.getters[`auth/${GET_USER_TOKEN_GETTER}`];
  params.append("auth", token); // duyệt đối không được để token ở dạng query string
  confirm.params = params;
  return confirm;
});

export default AxiosTokenInstance;
