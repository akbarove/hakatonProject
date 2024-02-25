const create = document.querySelector("#add");
const modal = document.querySelector(".modal");

function showModal() {
  if ((modal.style.display = "none")) {
    modal.style.display = "block";
  }
}
create.addEventListener("click", showModal);
