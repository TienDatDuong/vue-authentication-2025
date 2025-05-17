<template>
  <h2>Danh sách tài liệu</h2>
  <div>
    <div class="input-group mb-3">
    <button class="btn btn-outline-secondary" type="button" id="button-addon1">Tìm kiếm</button>
    <input type="text" class="form-control" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1">
  </div>
  </div>
  <table class="table">
    <thead>
      <tr>
        <th>Số Thứ tự</th>
        <th>Tên sách</th>
        <th>Mô tả</th>
        <th>Trạng thái</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="post in posts" :key="post.id">
        <td>{{ post.id }}</td>
        <td>{{ post.descript }}</td>
        <td>{{ post.title }}</td>
        <td>Đã cho mượn</td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import AxiosTokenInstance from "../services/AxiosTokenInstance";
import { mapGetters, mapMutations } from "vuex/dist/vuex.cjs.js";
import {
  GET_USER_TOKEN_GETTER,
  LOADING_SPINNER_SHOW_MUTATION,
} from "../store/module/auth/storecontant";

export default {
  name: "Post",
  data() {
    return {
      posts: [],
    };
  },
  computed: {
    ...mapGetters("auth", {
      token: GET_USER_TOKEN_GETTER,
    }),
  },
  mounted() {
    this.showLoading(true);
    AxiosTokenInstance.get(
      `http://authentication-vue3-default-rtdb.firebaseio.com/vue-3.json`
    )
      .then((res) => {
        this.showLoading(false);
        this.post = this.formatPost(res.data);
      })
      .catch((e) => {
        this.showLoading(false);
      });
  },
  methods: {
    ...mapMutations({
      showLoading: LOADING_SPINNER_SHOW_MUTATION,
    }),
    formatPost(data) {
      for (let key in data) {
        this.posts.push({
          ...data[key],
          id: key,
        });
      }
    },
  },
};
</script>
<style scoped></style>
