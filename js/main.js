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

//? modal logic
function showModal() {
  modal.style.display = "block";
}
function closeModal() {
  modal.style.display = "none";
}
create.addEventListener("click", showModal);
cencel.addEventListener("click", closeModal);

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

//? Register Connect
const emailInp = document.querySelector("#email");
const confirmEmail = document.querySelector("#confirmEmail");
const passwordInp = document.querySelector("#password");
const passwordConfirmInp = document.querySelector("#passwordConfirm");
const registerForm = document.querySelector(".input");
const registerBtn = document.querySelector(".register-button");
const USERS_API = "http://localhost:8000/users";


const saveButton = document.querySelector(".register-button");
saveButton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Button clicked!");
  registerUser(e);
});

// Rest of your existing JavaScript code


// ?Login Connect
const loginBtn = document.querySelector(".login-button");
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

registerUser();


