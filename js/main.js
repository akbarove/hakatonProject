const create = document.querySelector("#add");
const modal = document.querySelector(".modal");
const PRODUCTSAPI = "http://localhost:8000/products";
const cancelBtn = document.querySelectorAll("#cancel");

//! crud connect
const titleInp = document.querySelector("#title");
const categoryInp = document.querySelector("#category");
const imageInp = document.querySelector("#image");
const productsList = document.querySelector("#products");
const addProductForm = document.querySelector("#addProduct-form");

//? modal logic
function openModal() {
  modal.style.display = "block";
  modal.classList.add("modal-bg");
}
function closeModal() {
  modal.style.display = "none";
  modal.classList.remove("modal-bg");
}
create.addEventListener("click", openModal);
cancelBtn.addEventListener("click", closeModal);
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
  const data = await res.json();
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
