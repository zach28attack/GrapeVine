document.addEventListener("turbo:load", () => {
  const devisePage = document.querySelector(".new_user");
  const editDevisePage = document.querySelector(".edit_user");
  if (devisePage || editDevisePage) {
    validateDeviseForm();
  }
});
// validation for form input on Login/Logout/User Edit page
const validateDeviseForm = () => {
  const emailInput = document.querySelector('input[type="email"]');
  let timer;
  // add evenListener to email field and validate using REGEX
  emailInput.addEventListener("keypress", (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      validateEmailInput(e.target.value, emailInput);
    }, 1000);
  });

  // add evenListener to password field and validate length > 5
  const passwordInput = document.querySelector('input[name="user[password]"]');
  passwordInput.addEventListener("keypress", (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      validatePasswordInput(e.target.value, passwordInput);
    }, 1000);
  });

  // if confirm password field exist on page
  const passwordConfirmInput = document.querySelector('input[name="user[password_confirmation]"]');
  if (passwordConfirmInput) {
    // add evenListener to confirm-password field and validate its equal to password
    passwordConfirmInput.addEventListener("keypress", (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // function to determine if both passwords are equal
        confirmPassword(
          document.querySelector('input[name="user[password]"]').value,
          e.target.value,
          passwordConfirmInput
        );
      }, 1000);
    });
  }
};

const validateEmailInput = (email, emailField) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email)) {
    emailField.classList.remove("invalid-input");
    document.querySelector('input[type="submit"]').classList.remove("disabled");
    emailField.classList.add("valid-input");
  } else {
    emailField.classList.remove("valid-input");
    document.querySelector('input[type="submit"]').classList.add("disabled");
    emailField.classList.add("invalid-input");
  }
};

const validatePasswordInput = (password, passwordField) => {
  if (password.length > 5) {
    passwordField.classList.remove("invalid-input");
    document.querySelector('input[type="submit"]').classList.remove("disabled");
    passwordField.classList.add("valid-input");
  } else {
    passwordField.classList.remove("valid-input");
    passwordField.classList.add("invalid-input");
    document.querySelector('input[type="submit"]').classList.add("disabled");
  }
};

const confirmPassword = (password, confirmPassword, passwordField) => {
  if (password === confirmPassword) {
    passwordField.classList.remove("invalid-input");
    passwordField.classList.add("valid-input");
    document.querySelector('input[type="submit"]').classList.remove("disabled");
  } else {
    passwordField.classList.remove("valid-input");
    passwordField.classList.add("invalid-input");
    document.querySelector('input[type="submit"]').classList.add("disabled");
  }
};

const validateFoodForm = () => {};
const validateMealForm = () => {};
const validateDiaryForm = () => {};
