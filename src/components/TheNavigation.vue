<template>
  <nav class="library-navbar navbar navbar-expand-lg">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <!-- Menu cho người dùng chưa đăng nhập -->
          <template v-if="!isAuthenticated">
            <li class="nav-item">
              <router-link class="nav-link" to="/login">
                <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/signup">
                <i class="fas fa-user-plus me-2"></i>Đăng ký thành viên
              </router-link>
            </li>
          </template>

          <!-- Menu cho người dùng đã đăng nhập -->
          <template v-if="isAuthenticated">
            <li class="nav-item">
              <router-link class="nav-link" to="/posts">
                <i class="fas fa-list me-2"></i>Danh sách tài liệu
              </router-link>
            </li>
          </template>

          <!-- Menu cho quản lý -->
          <template v-if="isManager">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="fas fa-cogs me-2"></i>Quản lý hệ thống
              </a>
              <ul class="dropdown-menu">
                <li>
                  <router-link class="dropdown-item" to="/ql-dau-sach">
                    <i class="fas fa-book me-2"></i>Quản lý đầu sách
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/ql-nguoi-doc">
                    <i class="fas fa-users me-2"></i>Quản lý người đọc
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/ql-muon-tra">
                    <i class="fas fa-exchange-alt me-2"></i>Quản lý mượn trả
                  </router-link>
                </li>
              </ul>
            </li>
          </template>
        </ul>

        <!-- User menu -->
        <ul class="navbar-nav" v-if="isAuthenticated">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle user-menu" href="#" role="button" data-bs-toggle="dropdown">
              <i class="fas fa-user-circle me-2"></i>
              <span v-if="userEmail">{{ userEmail }}</span>
              <span v-else>Người dùng</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <a class="dropdown-item" href="#" @click.prevent="logout()">
                  <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { CHECK_ADMIN, IS_USER_AUTHENTICATE_GETTER, LOGOUT_ACTION } from '../store/module/auth/storecontant';

export default{
  data(){
    return{

    }
  },
  methods: {
    ...mapActions('auth',{
      logoutUser: LOGOUT_ACTION
    }),

    logout() {
      this.logoutUser();
      localStorage.removeItem('userData')
      this.$router.replace("/login")
    }
  },
  computed:{
    ...mapGetters('auth',{
      isAuthenticated: IS_USER_AUTHENTICATE_GETTER,
      isAdmin: CHECK_ADMIN
    }),
    ...mapState('auth', {
      userEmail: state => state.email
    }),
    isManager(){
      return (this.isAdmin && this.isAuthenticated)
    }
  }
}
</script>

<style scoped>
.library-navbar {
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.library-navbar .navbar-nav .nav-link {
  color: #2c3e50;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 0 0.25rem;
  transition: all 0.3s ease;
}

.library-navbar .navbar-nav .nav-link:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
}

.library-navbar .navbar-nav .nav-link.router-link-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.dropdown-menu {
  z-index: 1050; 
  position: absolute;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  padding: 0.5rem;
}

.dropdown-item {
  border-radius: 8px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateX(5px);
}

.user-menu {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  border-radius: 25px;
  padding: 0.5rem 1.5rem !important;
}

.user-menu:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.navbar-toggler {
  border: none;
  padding: 0.5rem;
}

.navbar-toggler:focus {
  box-shadow: none;
}

/* Responsive */
@media (max-width: 991.98px) {
  .library-navbar .navbar-nav .nav-link {
    margin: 0.25rem 0;
  }
  
  .user-menu {
    margin-top: 1rem;
  }
}
</style>