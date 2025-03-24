<template>
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div>
        <div>
          <h3>Signup</h3>
          <hr />
        </div>
        <div v-if="error" class="alert text-danger">{{ error }}</div>
        <form @submit.prevent="onSignUp()">
          <div class="form-group">
            <label>Email</label>
            <input type="text" class="form-control" v-model="user.email" />
            <p v-if="errors.email" class="text-danger">{{ errors.email }}</p>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              class="form-control"
              v-model="user.password"
            />
            <p v-if="errors.password" class="danger">{{ errors.password }}</p>
          </div>
          <div class="my-3">
            <button type="submit" class="btn btn-primary">Signup</button>
          </div>
        </form>
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
