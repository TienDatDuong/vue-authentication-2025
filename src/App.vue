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
  <div id="app">
    <!-- Header -->
    <header class="library-header">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h1 class="library-title">
              <i class="fas fa-book-open me-3"></i>
              HỆ THỐNG QUẢN LÝ THƯ VIỆN
            </h1>
            <p class="library-subtitle">Trường Đại học Mở Hà Nội</p>
          </div>
          <div class="col-md-6 text-end">
            <div class="header-info">
              <i class="fas fa-university me-2"></i>
              <span>Thư viện số hiện đại</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <Navigation />

    <!-- Main Content -->
    <main class="main-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <TheLoader v-if="showLoading" />
            <router-view></router-view>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="library-footer">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 text-center">
            <p>&copy; 2025 Hệ thống Quản lý Thư viện - Trường Đại học Mở Hà Nội</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.library-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.library-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.library-subtitle {
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
}

.header-info {
  font-size: 0.9rem;
  opacity: 0.8;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.library-footer {
  background: #2c3e50;
  color: white;
  padding: 1rem 0;
  margin-top: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .library-title {
    font-size: 1.4rem;
  }
  
  .library-subtitle {
    font-size: 0.9rem;
  }
  
  .header-info {
    font-size: 0.8rem;
  }
}
</style>
