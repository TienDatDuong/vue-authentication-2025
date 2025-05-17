<template>
  <h2 class="u-margin-bottom-small ">Quản lý người đọc, nhân sự của thư viện</h2>
  <div>
    <div class="input-group mb-3">
    <button class="btn btn-primary" type="button" @click="filterData()">Tìm kiếm</button>
    <input type="text" class="form-control" placeholder="Nhập tên tài liệu" v-model="search" />
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
      <tr v-for="post in filterPosts" :key="post.id">
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
      filterPosts: [],
      search: "",
    };
  },
  computed: {
    ...mapGetters("auth", {
      token: GET_USER_TOKEN_GETTER,
    }),
    // filterPosts(){
    //   if(!this.search){
    //     return this.posts;
    //   }
    //   return this.posts.filter((post) => {
    //     return (post.descript || "").toLowerCase().includes(this.search.toLowerCase());
    //   });
    // }
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
      const result = [];
      for (let key in data) {
        result.push({
          ...data[key],
          id: key,
        });
      }
      this.posts = result;
      this.filterPosts = result;
    },
    filterData() {
      const keyword = this.search.toLowerCase();
      if (!keyword) {
         this.filterPosts = this.posts;
        return;
      }
      this.filterPosts = this.posts.filter((post) => {
        return (post.descript || "").toLowerCase().includes(keyword);
      });
    },
  },
};
</script>
<style scoped></style>
