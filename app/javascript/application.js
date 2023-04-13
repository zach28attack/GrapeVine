// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails";
import "controllers";

const diaryFormToggles = document.querySelectorAll("#diary-form-toggle");
const foodListFormToggles = document.querySelectorAll(
  "#add-summary-item-toggle"
);
const getTimeOfDay = (e) => {
  return e.target.closest("#time-of-day").dataset.tod.toLowerCase();
};
// add event listeners to quick add buttons
diaryFormToggles.forEach((formToggle) => {
  formToggle.addEventListener("click", (e) => {
    // select time of day from data set in summary card to choose correct form template
    const timeOfDay = getTimeOfDay(e);
    const diaryFormTemplate = document.querySelector(
      `#${timeOfDay}-diary-form-template`
    ).content;
    const diaryFormModal = diaryFormTemplate
      .querySelector(".diary-form-modal")
      .cloneNode(true);

    // add form to page and add event listener to close
    document.querySelector("body").appendChild(diaryFormModal);
    diaryFormModal.addEventListener("click", (e) => {
      if (e.target === diaryFormModal) {
        diaryFormModal.remove();
      }
    });
  });
});

// close modal on keypress escape
document.addEventListener("keypress", (e) => {
  if (
    e.key === "Escape" &&
    document
      .querySelector("body")
      .contains(document.querySelector("#diary-form-modal"))
  ) {
    document.querySelector("#diary-form-modal").remove();
  } else if (
    e.key === "Escape" &&
    document
      .querySelector("body")
      .contains(document.querySelector("#food-list-form-modal"))
  ) {
    document.querySelector("#food-list-form-modal").remove();
  }
});

// assign event listeners to each food list form button
foodListFormToggles.forEach((formToggle) => {
  formToggle.addEventListener("click", (e) => {
    // select time of day from data set in summary card
    const timeOfDay = getTimeOfDay(e);
    const foodListFormTemplate = document.querySelector(
      `#${timeOfDay}-form`
    ).content;
    const foodListFormModal = foodListFormTemplate
      .querySelector(".diary-form-modal")
      .cloneNode(true);
    // add form modal to page and add event listener to close
    document.querySelector("body").appendChild(foodListFormModal);
    foodListFormModal.addEventListener("click", (e) => {
      if (e.target === foodListFormModal) {
        foodListFormModal.remove();
      }
    });
  });
});
