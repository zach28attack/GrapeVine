// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails";
import "controllers";

const diaryFormToggles = document.querySelectorAll("#diary-form-toggle");
const diaryFormTemplate = document.querySelector(
  "#diary-form-template"
).content;
const diaryFormModal = diaryFormTemplate
  .querySelector(".diary-form-modal")
  .cloneNode(true);

const foodListFormToggles = document.querySelectorAll(
  "#add-summary-item-toggle"
);
const foodListFormTemplate = document.querySelector(
  "#food-list-form-template"
).content;
const foodListFormModal = foodListFormTemplate
  .querySelector(".diary-form-modal")
  .cloneNode(true);

diaryFormToggles.forEach((formToggle) => {
  formToggle.addEventListener("click", () => {
    document.querySelector("body").appendChild(diaryFormModal);
  });
});
diaryFormModal.addEventListener("click", (e) => {
  if (e.target === diaryFormModal) {
    diaryFormModal.remove();
  }
});
document.addEventListener("keypress", (e) => {
  if (
    e.key === "Escape" &&
    document.querySelector("body").contains(diaryFormModal)
  ) {
    diaryFormModal.remove();
  } else if (
    e.key === "Escape" &&
    document.querySelector("body").contains(foodListFormModal)
  ) {
    foodListFormModal.remove();
  }
});

foodListFormToggles.forEach((formToggle) => {
  formToggle.addEventListener("click", () => {
    console.log("Click");
    document.querySelector("body").appendChild(foodListFormModal);
  });
});
foodListFormModal.addEventListener("click", (e) => {
  if (e.target === foodListFormModal) {
    foodListFormModal.remove();
  }
});
