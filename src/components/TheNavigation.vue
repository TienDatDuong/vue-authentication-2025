<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <!-- <li class="nav-item">
            <router-link class="nav-link" v-if="isAuthenticated" to="/">Home</router-link>
          </li> -->
          <li class="nav-item">
            <router-link class="nav-link active" v-if="!isAuthenticated" to="/login">Login</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" v-if="!isAuthenticated" to="/signup">Đăng ký thành viên</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link " v-if="isAuthenticated" to="/posts">Tài liệu</router-link>
          </li>
           <!-- <li class="nav-item">
            <router-link class="nav-link " v-if="isAuthenticated" to="/posts">Tài liệu</router-link>
          </li>
           <li class="nav-item">
            <router-link class="nav-link " v-if="isAuthenticated" to="/posts">PTài liệu</router-link>
          </li> -->
          <li class="nav-item" v-if="isAuthenticated">
            <a href="#" class="nav-link" @click.prevent="logout()">Đăng xuất</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { IS_USER_AUTHENTICATE_GETTER, LOGOUT_ACTION } from '../store/module/auth/storecontant';

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
      isAuthenticated: IS_USER_AUTHENTICATE_GETTER
    })
  }
}
</script>