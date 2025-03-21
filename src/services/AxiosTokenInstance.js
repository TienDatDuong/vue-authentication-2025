import axios from "axios";

const AxiosTokenInstance = axios.create({});

AxiosTokenInstance.interceptors.request.use((confirm) => {
  //   let params = new URLSearchParams();
  return confirm;
});

export default AxiosTokenInstance;
