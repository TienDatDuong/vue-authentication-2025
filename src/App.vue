<script>
import { mapState } from "vuex";
import Navigation from "/src/components/TheNavigation.vue";
import TheLoader from "/src/components/loader.vue";
export default {
  name: "App",
  components: { Navigation, TheLoader },
  computed: {
    ...mapState({
      showLoading: (stage) => stage.showLoading,
    }),
  },
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
