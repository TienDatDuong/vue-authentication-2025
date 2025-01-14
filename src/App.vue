<script setup>
import Navigation from "/src/components/TheNavigation.vue";
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <Navigation />
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
