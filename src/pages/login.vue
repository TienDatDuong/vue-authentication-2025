<template>
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div>
        <div>
          <h3>Login</h3>
          <hr />
        </div>
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
    onLogin() {
      let validations = new SignupValidations(
        this.user.email,
        this.user.password
      );
      //check validate
      this.errors = validations.checkValidations();
      if (this.errors.length) {
        return false;
      }
    },
  },
  // computed: {
  //   ...mapState("auth", {
  //     firstName: (state) => state.name,
  //   }),
  // },
};
</script>
