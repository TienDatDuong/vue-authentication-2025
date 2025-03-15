import Validations from "./valiadtion";

export default class SignupValidations {
  constructor(email, password) {
    (this.email = email), (this.password = password);
  }

  checkValidations() {
    let error = [];

    //email validations
    if (!Validations.checkEmail(this.email)) {
      error["email"] = "Invalid Email";
    }
    //passworf validations
    if (!Validations.minLength(this.password, 6)) {
      error["password"] = "password should be of 6 characters";
    }

    return error;
  }
}
