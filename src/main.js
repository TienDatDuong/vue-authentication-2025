import { createApp } from "vue";
import router from "./router";
import "./style.css";
import App from "./App.vue";
import Store from "./store/store";

const app = createApp(App);

app.use(Store);
app.use(router);

app.mount("#app");
