<template>
  <div class="login-bg">
    <div class="login-center">
      <div class="login-card">
        <div class="login-header">
          <div class="login-icon">
            <i class="fas fa-book-open"></i>
          </div>
          <h3 class="login-title">Đăng nhập hệ thống</h3>
          <p class="login-subtitle">Thư viện Trường Đại học Mở Hà Nội</p>
        </div>
        
        <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="fas fa-exclamation-triangle me-2"></i>
          {{ error }}
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
        
        <form @submit.prevent="onLogin()" class="login-form">
          <div class="form-group mb-4">
            <label class="form-label">
              <i class="fas fa-envelope me-2"></i>Email
            </label>
            <input 
              type="email" 
              class="form-control form-control-lg" 
              v-model="user.email"
              placeholder="Nhập email của bạn"
              required
            />
            <div v-if="errors?.email" class="invalid-feedback d-block">
              <i class="fas fa-times-circle me-1"></i>
              {{ errors?.email }}
            </div>
          </div>
          
          <div class="form-group mb-4">
            <label class="form-label">
              <i class="fas fa-lock me-2"></i>Mật khẩu
            </label>
            <div class="input-group">
                <div class="input-password">
                    <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control form-control-lg"
                    v-model="user.password"
                    placeholder="Nhập mật khẩu"
                    required
                    />
                </div>

                <div>
                    <button 
                        type="button" 
                        class="btn btn-outline-secondary"
                        @click="showPassword = !showPassword"
                        tabindex="-1"
                    >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                </div>
              
              
            </div>
            <div v-if="errors?.password" class="invalid-feedback d-block">
              <i class="fas fa-times-circle me-1"></i>
              {{ errors?.password }}
            </div>
          </div>
          
          <div class="d-grid mb-3">
            <button type="submit" class="btn btn-primary btn-lg login-btn">
              <i class="fas fa-sign-in-alt me-2"></i>
              Đăng nhập
            </button>
          </div>
        </form>
        
        <div class="login-footer">
          <p class="text-center mb-0">
            Chưa có tài khoản? 
            <router-link to="/signup" class="text-decoration-none">
              <i class="fas fa-user-plus me-1"></i>Đăng ký ngay
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SignupValidations from "../services/signupValidations";
import {
  LOADING_SPINNER_SHOW_MUTATION,
  LOGIN_ACTION,
} from "../store/module/auth/storecontant";
import { mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      errors: [],
      error: "",
      showPassword: false,
    };
  },
  methods: {
    ...mapActions("auth", {
      login: LOGIN_ACTION,
    }),
    ...mapMutations({
      showLoading: LOADING_SPINNER_SHOW_MUTATION,
    }),
    async onLogin() {
      let validations = new SignupValidations(
        this.user.email,
        this.user.password
      );
      //check validate
      this.errors = validations.checkValidations();   
      if (this.errors.length) {
        return false;
      } else {
        this.showLoading(true);
        await this.login({
          email: this.user.email,
          password: this.user.password,
        }).catch((e) => {
          console.log("e", e);
          (this.error = e), this.showLoading(false);
        });
        this.showLoading(false);
        this.$router.push("/posts");
      }
    },
  },
};
</script>

<style scoped>
.login-bg {
  min-height: 80vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
}
.login-center {
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
  padding: 2.5rem 2.2rem 2rem 2.2rem;
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-header {
  text-align: center;
  margin-bottom: 2rem;
}
.login-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.2rem;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.18);
}
.login-icon i {
  font-size: 2.2rem;
  color: white;
}
.login-title {
  color: #2c3e50;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 0.3rem;
}
.login-subtitle {
  color: #7f8c8d;
  font-size: 1rem;
  margin: 0;
}
.form-label {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.form-control {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  font-size: 1.05rem;
}
.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
}

.input-group {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    flex-wrap: nowrap;
}

.input-password {
    width: 100%;
}

.input-group .btn {
height: 100%;
  border: 2px solid #e9ecef;
  border-left: none;
  border-radius: 0 12px 12px 0;
  background: #f8f9fa;
}
.input-group .form-control {
  border-right: none;
  border-radius: 12px 0 0 12px;
}
.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}
.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.18);
}
.login-footer {
  margin-top: 2rem;
  padding-top: 1.2rem;
  border-top: 1px solid #e9ecef;
  width: 100%;
}
.login-footer a {
  color: #667eea;
  font-weight: 600;
}
.login-footer a:hover {
  color: #764ba2;
}
.alert {
  border-radius: 12px;
  border: none;
}
.alert-danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
}
.invalid-feedback {
  color: #dc3545;
  font-size: 0.95rem;
  margin-top: 0.25rem;
}
.login-form {
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.login-form .form-group {
  width: 100%;
}
.login-form .form-control,
.login-form .input-group,
.login-form .btn {
  width: 100%;
  min-width: 0;
}
@media (max-width: 600px) {
  .login-card {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
    max-width: 98vw;
  }
  .login-header {
    margin-bottom: 1.2rem;
  }
  .login-footer {
    margin-top: 1.2rem;
    padding-top: 0.7rem;
  }
  .login-form {
    max-width: 98vw;
    padding: 0;
  }
}
</style>