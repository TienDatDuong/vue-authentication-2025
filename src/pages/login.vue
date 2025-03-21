<template>
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div>
        <div>
          <h3>Login</h3>
          <hr />
        </div>
        <div v-if="error" class="alert text-danger">{{ error }}</div>
        <form @submit.prevent="onLogin()">
          <div class="form-group">
            <label>Email</label>
            <input type="text" class="form-control" v-model="user.email" />
            <div v-if="errors?.email" class="text-danger">
              {{ errors?.email }}
            </div>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              class="form-control"
              v-model="user.password"
            />
            <div v-if="errors?.password" class="text-danger">
              {{ errors?.password }}
            </div>
          </div>
          <div class="my-3">
            <button type="submit" class="btn btn-primary">Login</button>
          </div>
        </form>
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
