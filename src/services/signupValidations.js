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

  static getErrorMessageFromCode(errorCode) {
    switch (errorCode) {
      case "EMAIL_EXISTS":
        return "Email already exists";
      case "INVALID_PASSWORD":
        return "The password is invalid or the user does not have a password";
      case "EMAIL_NOT_FOUND":
        return "Email not found";
      default:
        return "Unexpected error occuered. Please try again";
    }
  }
}
