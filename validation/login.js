const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Email is required.";
  }

  if (!isEmpty(data.email) && !validator.isEmail(data.email)) {
    errors.email = "Email is invalid.";
  }

  if (isEmpty(data.password)) {
    errors.password = "Password is required.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
