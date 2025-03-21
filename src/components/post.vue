<template>
  <h2>Post Details</h2>
  <table class="table">
    <thead>
      <tr>
        <th>Id</th>
        <th>Title</th>
        <th>Descripttion</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="post in posts" :key="post.id">
        <td>{{ post.id }}</td>
        <td>{{ post.descript }}</td>
        <td>{{ post.title }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import axios from "axios";
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
    axios
      .get(
        `http://authentication-vue3-default-rtdb.firebaseio.com/vue-3.json?auth=${this.token}`
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
