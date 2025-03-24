<script>
import { mapState } from "vuex";
import Navigation from "/src/components/TheNavigation.vue";
import TheLoader from "/src/components/loader.vue";
import { AUTH_LOGIN_ACTION } from "./store/module/auth/storecontant";
export default {
  name: "App",
  components: { Navigation, TheLoader },
  computed: {
    ...mapState({
      showLoading: (stage) => stage.showLoading,
    }),
  },
  created(){
    this.$store.dispatch(`auth/${AUTH_LOGIN_ACTION}`)
  }
};
</script>

<template>
  <Navigation />
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <TheLoader v-if="showLoading" />
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
