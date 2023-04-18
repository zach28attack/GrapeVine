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

async function submitForm(form) {
  // get data from submitted form
  const formData = new FormData(form);

  // send form data to controller and handle response
  const response = await fetch(form.action, {
    method: form.method,
    body: formData,
    headers: {
      Accept: "application/json",
      "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
    },
    credentials: "same-origin",
  });

  // if successful update page
  if (response.ok) {
    const data = await response.json();
    updateCalorieSum(data.data);
  }
}

async function updateCalorieSum(data) {
  document.querySelector("#sum-of-calories").textContent = `Total Cals:${data}`;
}

const removeFoodButtons = document.querySelectorAll("#remove-food-button");
removeFoodButtons.forEach((removeFoodButton) => {
  removeFoodButton.addEventListener("click", (event) => {
    const mealItem = event.target.closest(".meal-item");
    event.preventDefault();
    const mealId = event.target.closest("#remove-food-button").dataset.mealId;
    deleteFood(mealId, mealItem);
  });
});

async function deleteFood(id, object) {
  const response = await fetch(`/foods_meals/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
    },
  });
  if (response.ok) {
    const data = await response.json();
    object.remove();
    updateCalorieSum(data.data);
  } else {
    console.error("Error");
  }
}
const activateTabs = () => {
  const tabs = document.querySelector("#tabs");
  const [...tabsChildren] = tabs.children;
  tabsChildren.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      // Remove the "active" class from all tabs
      tabsChildren.forEach((child) => {
        if (child.classList.contains("active")) {
          child.classList.remove("active");
        }
      });
      // Add the "active" class to the clicked tab
      e.target.classList.add("active");
    });
  });
};
const renderFormModal = (e) => {
  const timeOfDay = e.target.closest(".summary-table").dataset.tod;
  const formModalTemplate = document.querySelector(
    `#${timeOfDay}-form-modal-template`
  ).content;
  const formModal = formModalTemplate
    .querySelector("#form-modal")
    .cloneNode(true);
  document.querySelector("body").appendChild(formModal);

  // close modal
  formModal.addEventListener("click", (e) => {
    if (e.target === formModal) {
      formModal.remove();
    }
  });
};

// const editFormModalButton = document.querySelector("#edit-form-modal");
// console.log(editFormModalButton);
// editFormModalButton.addEventListener("click", (e) => {
//   e.preventDefault()
//   tabsChildren.forEach((tab) => {
//     if (tab.dataset.id === e.target.id) {
//       tab.classList.remove("hidden");
//     }
//   });
// });

const formModalTemplateButtons =
  document.querySelectorAll("#form-modal-toggle");
// console.log(formModalTemplateButtons);
formModalTemplateButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    renderFormModal(e);
    activateTabs();
  });
});
