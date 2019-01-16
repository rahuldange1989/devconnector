const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  if (
    !isEmpty(data.name) &&
    !(validator.isLength(data.name), { min: 2, max: 30 })
  ) {
    errors.name = "Name must be between 2 & 30 characters";
  }

  if (isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required";
  }

  if (!isEmpty(data.email) && !validator.isEmail(data.email)) {
    errors.email = "Email is invalid.";
  }

  if (
    !isEmpty(data.password) &&
    !validator.isLength(data.password, { min: 6, max: 30 })
  ) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (
    !isEmpty(data.password) &&
    !isEmpty(data.password2) &&
    !validator.equals(data.password, data.password2)
  ) {
    errors.password2 = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
