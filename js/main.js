const create = document.querySelector("#add");
const modal = document.querySelector(".modal");

function showModal() {
  if (modal.style.display === "none") {
    modal.style.display = "block";
  }
}

// create.addEventListener("click", showModal);

//? Register Connect
const emailInp = document.querySelector("#email");
const confirmEmail = document.querySelector("#confirmEmail");
const passwordInp = document.querySelector("#password");
const passwordConfirmInp = document.querySelector("#passwordConfirm");
const registerForm = document.querySelector(".input");
const USERS_API = "http://localhost:8000/users";

const saveButton = document.querySelector(".register-button");
saveButton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Button clicked!");
  registerUser(e);
});

// Rest of your existing JavaScript code

// ?Login Connect
const loginForm = document.querySelector("#loginUser-form");
const logUserInp = document.querySelector("#email-login");
const logPasswordInp = document.querySelector("#password-login");

passwordInp.addEventListener("input", () => {
  validatePassword(passwordInp.value);
});

passwordConfirmInp.addEventListener("input", () => {
  validatePasswordConfirmation(passwordInp.value, passwordConfirmInp.value);
});

function validatePassword(password) {
  if (password.length < 6) {
    setInputBorder(passwordInp, "red");
  } else {
    setInputBorder(passwordInp, "green");
  }
}

function validatePasswordConfirmation(password, confirmPassword) {
  if (confirmPassword.length < 6 || password !== confirmPassword) {
    setInputBorder(passwordConfirmInp, "red");
  } else {
    setInputBorder(passwordConfirmInp, "green");
  }
}

function setInputBorder(element, color) {
  element.style.border = `3px solid ${color}`;
  element.style.borderRadius = "3px";
}

async function checkUniqueEmail(email) {
  let res = await fetch(USERS_API);
  let users = await res.json();
  return users.some((item) => item.email === email);
}

async function registerUser(e) {
  e.preventDefault();

  if (
    !emailInp.value.trim() ||
    !confirmEmail.value.trim() ||
    !passwordInp.value.trim() ||
    !passwordConfirmInp.value.trim()
  ) {
    alert("Some inputs are empty");
    return;
  }

  if (passwordInp.value !== passwordConfirmInp.value) {
    alert("Passwords are not correct");
    return;
  }

  if (passwordInp.value.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  if (await checkUniqueEmail(emailInp.value)) {
    alert("Email already exists!");
    return;
  }

  const userObj = {
    confirmEmail: confirmEmail.value,
    email: emailInp.value,

    isAdmin: false,
    password: passwordInp.value,
  };

  fetch(USERS_API, {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  emailInp.value = "";
  confirmEmail.value = "";
  passwordInp.value = "";
  passwordConfirmInp.value = "";

  alert("Successful registration");
}

registerForm.addEventListener("submit", registerUser);

//? login logic

async function checkUserPassword(email, password) {
  let res = await fetch(USERS_API);
  let users = await res.json();
  const userObj = users.find((item) => item.email === email);
  return userObj.password === password ? true : false;
}

function initStorage() {
  if (!localStorage.getItem("email")) {
    localStorage.setItem("email", "{}");
  }
}

function setUserToStorage(email, isAdmin = false) {
  localStorage.setItem(
    "user",
    JSON.stringify({ email: email, isAdmin: isAdmin })
  );
}

async function loginUser(e) {
  e.preventDefault();

  if (!logUserInp.value.trim() || !logPasswordInp.value.trim()) {
    alert("Some inputs are empty");
    return;
  }
  let account = await checkUniqueEmail(logUserInp.value);
  if (!account) {
    alert("No account");
    return;
  }
  let logPass = await checkUserPassword(logUserInp.value, logPasswordInp.value);
  if (!logPass) {
    alert("Wrong password");
    return;
  }

  let res = await fetch(USERS_API);
  let users = await res.json();
  const userObj = users.find((item) => item.email === logUserInp.value);
  render();

  initStorage();
  setUserToStorage(userObj.email, userObj.isAdmin);

  logUserInp.value = "";
  logPasswordInp.value = "";

  alert("Success");
}

loginForm.addEventListener("submit", loginUser);
