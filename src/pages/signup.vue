<template>
  <div class="signup-bg">
    <div class="signup-center">
      <div class="signup-card">
        <div class="signup-header">
          <div class="signup-icon">
            <i class="fas fa-user-plus"></i>
          </div>
          <h3 class="signup-title">Đăng ký thành viên</h3>
          <p class="signup-subtitle">Tạo tài khoản thư viện số</p>
        </div>
        <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="fas fa-exclamation-triangle me-2"></i>
          {{ error }}
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
        <form @submit.prevent="onSignUp()" class="signup-form">
          <div class="form-group mb-4">
            <label class="form-label">
              <i class="fas fa-envelope me-2"></i>Email
            </label>
            <input type="email" class="form-control form-control-lg" v-model="user.email" placeholder="Nhập email của bạn" required />
            <div v-if="errors.email" class="invalid-feedback d-block">
              <i class="fas fa-times-circle me-1"></i>
              {{ errors.email }}
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
            <div v-if="errors.password" class="invalid-feedback d-block">
              <i class="fas fa-times-circle me-1"></i>
              {{ errors.password }}
            </div>
          </div>
          <div class="d-grid mb-3">
            <button type="submit" class="btn btn-success btn-lg signup-btn">
              <i class="fas fa-user-plus me-2"></i>
              Đăng ký
            </button>
          </div>
        </form>
        <div class="signup-footer">
          <p class="text-center mb-0">
            Đã có tài khoản? 
            <router-link to="/login" class="text-decoration-none">
              <i class="fas fa-sign-in-alt me-1"></i>Đăng nhập
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {
  LOADING_SPINNER_SHOW_MUTATION,
  SIGNUP_ACTION,
} from "../store/module/auth/storecontant";
import SignupValidations from "../services/signupValidations";
import { mapMutations } from "vuex/dist/vuex.cjs.js";

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
      signup: SIGNUP_ACTION,
    }),
    ...mapMutations({
      showLoading: LOADING_SPINNER_SHOW_MUTATION,
    }),
    async onSignUp() {
      let validations = new SignupValidations(
        this.user.email,
        this.user.password
      );
      //check validate
      this.errors = validations.checkValidations();
      if ("email" in this.errors || "password" in this.errors) {
        return false;
      }
      //make spinner true
      await this.showLoading(true);
      //signup registration
      this.signup({
        email: this.user.email,
        password: this.user.password,
      }).catch((e) => {
        this.error = e;
        this.showLoading(false);
      });
      this.showLoading(false);
      this.$router.push("/login")
      //make spinner false
    },
  },
};
</script>

<style scoped>
.signup-bg {
  min-height: 80vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
}
.signup-center {
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.signup-card {
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
.signup-header {
  text-align: center;
  margin-bottom: 2rem;
}
.signup-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.2rem;
  box-shadow: 0 4px 16px rgba(40, 167, 69, 0.18);
}
.signup-icon i {
  font-size: 2.2rem;
  color: white;
}
.signup-title {
  color: #2c3e50;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 0.3rem;
}
.signup-subtitle {
  color: #7f8c8d;
  font-size: 1rem;
  margin: 0;
}
.signup-form {
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.signup-form .form-group {
  width: 100%;
}
.signup-form .form-control,
.signup-form .input-group,
.signup-form .btn {
  width: 100%;
  min-width: 0;
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
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.15);
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
.signup-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  border-radius: 12px;
  padding: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}
.signup-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(40, 167, 69, 0.18);
}
.signup-footer {
  margin-top: 2rem;
  padding-top: 1.2rem;
  border-top: 1px solid #e9ecef;
  width: 100%;
}
.signup-footer a {
  color: #28a745;
  font-weight: 600;
}
.signup-footer a:hover {
  color: #20c997;
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
@media (max-width: 600px) {
  .signup-card {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
    max-width: 98vw;
  }
  .signup-header {
    margin-bottom: 1.2rem;
  }
  .signup-footer {
    margin-top: 1.2rem;
    padding-top: 0.7rem;
  }
  .signup-form {
    max-width: 98vw;
    padding: 0;
  }
}
</style>
