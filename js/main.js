const create = document.querySelector("#add");
const cencel = document.querySelector("#cancel");
const modal = document.querySelector(".modal");
const PRODUCTSAPI = "http://localhost:8000/products";

//! crud connect
const titleInp = document.querySelector("#title");
const descInp = document.querySelector("#desc");
const categoryInp = document.querySelector("#category");
const imageInp = document.querySelector("#image");
const productsList = document.querySelector("#products");
const addProductForm = document.querySelector("#addProduct-form");

//?modal logic
function showModal() {

  modal.style.display = "block";
  modal.classList.add(".modal-bg");
}
function closeModal() {
  modal.style.display = "none";
  modal.classList.remove(".modal-bg");
}
create.addEventListener("click", showModal);
cencel.addEventListener("keyup", closeModal);
//?
function initStorage() {
  if (!localStorage.getItem("user")) {
    localStorage.setItem("user", "{}");
  }
}

async function createCard(e) {
  e.preventDefault();
  if (
    !titleInp.value.trim() ||
    !categoryInp.value.trim() ||
    !imageInp.value.trim()
  ) {
    alert("Please fill all fields");
    return;
  }

  const newCard = {
    title: titleInp.value,
    category: categoryInp.value,
    image: imageInp.value,
  };

  await fetch(PRODUCTSAPI, {
    method: "POST",
    body: JSON.stringify(newCard),
    headers: { "Content-type": "application/json;charset=utf-8" },
  });
  render();
  inputsClear();
  console.log("hello");
}

function inputsClear(...rest) {
  for (let i = 0; i < rest.length; i++) {
    rest[i].value = "";
  }
}

async function render() {
  let requestAPI = `${PRODUCTSAPI}`;
  const res = await fetch(requestAPI);
  const data = await res.json(); // Await the JSON parsing
  initStorage();
  const user = JSON.parse(localStorage.getItem("user"));
  productsList.innerHTML = "";
  data.forEach((card) => {
    productsList.innerHTML += `
      <div class='productsList'>
        <img width="300px" height="300px" object-fit="contain" src=${
          card.image
        } />
        <div><b>${card.title}</b></div>
        <div><b>Category:</b>${card.category}</div>
        ${
          user.isAdmin
            ? `
              <button id=${card.id} class='deleteBtn' >Delete</button>
              <button id=${card.id} class='editBtn' >Edit</button>
            `
            : ""
        }
      </div>`;
  });
}

addProductForm.addEventListener("submit", createCard);

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

async function checkUniqueUserName(username) {
  let res = await fetch(USERS_API);
  let users = await res.json();
  return users.some((item) => item.username === username);
}

async function registerUser(e) {
  e.preventDefault();

  const userNameInp = document.querySelector("#username");
  const ageInp = document.querySelector("#age");

  if (
    !userNameInp.value.trim() ||
    !emailInp.value.trim() ||
    !ageInp.value.trim() ||
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

  if (/\d/.test(userNameInp.value)) {
    alert("Username should not contain numbers");
    return;
  }

  if (await checkUniqueUserName(userNameInp.value)) {
    alert("Username already exists!");
    return;
  }

  const userObj = {
    username: userNameInp.value,
    email: emailInp.value,
    age: ageInp.value,
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

  userNameInp.value = "";
  emailInp.value = "";
  ageInp.value = "";
  passwordInp.value = "";
  passwordConfirmInp.value = "";

  alert("Successful registration");
}

registerForm.addEventListener("submit", registerUser);

//? login logic

async function checkUserPassword(username, password) {
  let res = await fetch(USERS_API);
  let users = await res.json();
  const userObj = users.find((item) => item.username === username);
  return userObj.password === password ? true : false;
}

function initStorage() {
  if (!localStorage.getItem("user")) {
    localStorage.setItem("user", "{}");
  }
}

function setUserToStorage(username, isAdmin = false) {
  localStorage.setItem(
    "user",
    JSON.stringify({ user: username, isAdmin: isAdmin })
  );
}

async function loginUser(e) {
  e.preventDefault();

  if (!logUserInp.value.trim() || !logPasswordInp.value.trim()) {
    showMessage("Some inputs are empty");
    return;
  }
  let account = await checkUniqueUserName(logUserInp.value);

  if (!account) {
    showMessage("No account");
    return;
  }
  let logPass = await checkUserPassword(logUserInp.value, logPasswordInp.value);
  if (!logPass) {
    showMessage("Wrong password");
    return;
  }

  let res = await fetch(USERS_API);
  let users = await res.json();
  const userObj = users.find((item) => item.username === logUserInp.value);
  render();

  initStorage();
  setUserToStorage(userObj.username, userObj.isAdmin);

  logUserInp.value = "";
  logPasswordInp.value = "";

  showMessage("Success");
  checkStatus();
}
loginForm.addEventListener("submit", loginUser);

