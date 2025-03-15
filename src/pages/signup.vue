<template>
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div>
        <div>
          <h3>Signup</h3>
          <hr />
        </div>
        <form @submit.prevent="onSignUp()">
          <div class="form-group">
            <label>Email</label>
            <input type="text" class="form-control" v-model="user.email" />
            <p v-if="errors.email">{{ errors.email }}</p>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              class="form-control"
              v-model="user.password"
            />
            <p v-if="errors.password">{{ errors.password }}</p>
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
import { SIGNUP_ACTION } from "../store/module/auth/storecontant";
import SignupValidations from "../services/signupValidations";

export default {
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      errors: [],
    };
  },
  methods: {
    ...mapActions("auth", {
      signup: SIGNUP_ACTION,
    }),
    onSignUp() {
      let validations = new SignupValidations(
        this.user.email,
        this.user.password
      );
      //check validate
      this.errors = validations.checkValidations();
      if ("email" in this.errors || "password" in this.errors) {
        return false;
      }

      //signup registration
      this.signup({ email: this.user.email, password: this.user.password });
    },
  },
};
</script>
