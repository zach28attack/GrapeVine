// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails";
import "controllers";

const diaryFormToggles = document.querySelectorAll("#diary-form-toggle");
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
      .contains(document.querySelector(".diary-form-modal"))
  ) {
    document.querySelector(".diary-form-modal").remove();
  } else if (
    e.key === "Escape" &&
    document
      .querySelector("body")
      .contains(document.querySelector("#food-list-form-modal"))
  ) {
    document.querySelector("#food-list-form-modal").remove();
  }
});

const activateTabs = () => {
  const tabs = document.querySelector("#tabs");
  const [...tabsChildren] = tabs.children;
  tabsChildren.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      removeMealsForm();
      toggleNewFoodForm(tab);
      // onNewFoodSubmit();
      const forms = document.querySelectorAll(".food-list");

      // Remove the "active" class from all tabs
      tabsChildren.forEach((tab) => {
        if (tab.classList.contains("active")) {
          tab.classList.remove("active");
        }
      });

      // Add the "active" class to the clicked tab
      e.target.classList.add("active");

      // give every form class of hidden
      forms.forEach((form) => {
        if (!form.classList.contains("hidden")) {
          form.classList.add("hidden");
        }
      });

      // select form by active tab
      const activeTab = document.querySelector(`#${tab.dataset.form}-form`);
      // remove hidden class from selected form
      activeTab.classList.toggle("hidden");

      if (activeTab.id === "meals-form") {
        getMeals();
        enableCancelButton();
        openCreateMealForm();
      }
    });
  });
};

async function getMeals() {
  clearMeals();
  const response = await fetch("/meals", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
    },
  });

  if (response.ok) {
    const data = await response.json();
    mealsHTML(data);
  }
}

const mealsHTML = (data) => {
  const mealBody = document
    .querySelector("#meals-form")
    .querySelector(".meal-body");
  const mealTemplate = mealBody.querySelector("#meal-template").content;
  const mealsArray = data.meals;
  mealsArray.forEach((mealObj) => {
    const mealNode = mealTemplate.querySelector("form").cloneNode(true);
    const mealName = mealNode.querySelector(".meal-item-name");
    const mealItemId = mealNode.querySelector(".meal-item");
    const mealCalSum = mealNode.querySelector("#meal-cal-sum");
    const mealCalInput = mealNode.querySelector(
      "input[name='diary[calories]']"
    );
    const mealProteinSum = mealNode.querySelector("#meal-protein-sum");
    const mealProteinInput = mealNode.querySelector(
      "input[name='diary[protein]']"
    );
    const mealFatsSum = mealNode.querySelector("#meal-fats-sum");
    const mealFatsInput = mealNode.querySelector("input[name='diary[fats]']");
    const mealCarbSum = mealNode.querySelector("#meal-carbs-sum");
    const mealCarbInput = mealNode.querySelector("input[name='diary[carbs]']");
    mealName.innerHTML = mealObj.meal.meal_name;
    mealItemId.dataset.id = mealObj.meal.id;
    mealCalSum.innerHTML = `Cals. ${mealObj.calories}/`;
    mealCalInput.value = mealObj.calories;
    mealFatsSum.innerHTML = ` Fats ${mealObj.fats}/`;
    mealFatsInput.value = mealObj.fats;
    mealProteinSum.innerHTML = ` Prot. ${mealObj.protein}/`;
    mealProteinInput.value = mealObj.protein;
    mealCarbSum.innerHTML = `Carbs. ${mealObj.carbs}`;
    mealCarbInput.value = mealObj.carbs;
    mealBody.appendChild(mealNode);
    onEditMealClick(mealNode);
  });
};

// when edit btn is clicked render new foods_meal
const onEditMealClick = (mealNode) => {
  const editMealButton = mealNode.querySelector(".meal-edit-button");
  editMealButton.addEventListener("click", async (e) => {
    const mealId = e.target.closest(".meal-item").dataset.id;
    e.preventDefault();

    const data = await getFoods(mealId);
    // remove all forms if they exist
    const customHTMLForms = document.querySelectorAll("#new-foods-meal-form");
    customHTMLForms.forEach((form) => {
      form.remove();
    });

    renderNewFoodsMealForm(data);
    updateCalorieSum(data.sum_of_calories);

    //iterate through array of foods_meal objects with meal.id
    data.foods_meals.forEach((foodsMeal) => {
      data.foods_in_meal.forEach((food) => {
        if (foodsMeal.food_id === food.id) {
          updateFoodList(food, foodsMeal.id);
        }
      });
    });
  });
};

const renderNewFoodsMealForm = (data) => {
  const foods = data.foods;
  const meal = data.meal;
  const foodsInMeal = data.foods_in_meal;
  const forms = document.querySelectorAll(".food-list");
  forms.forEach((form) => {
    // hide all forms
    if (!form.classList.contains("hidden")) {
      form.classList.add("hidden");
    }

    if (form.id === "foods-meal-form" && form.dataset.formType === undefined) {
      form.classList.remove("hidden");
      updateNewFoodsMealHTML(form, foods, meal, foodsInMeal);

      // add event listeners to foods_meal forms to toggle new/edit forms
      const foodsMealButtons = document.querySelectorAll(
        "#foods-meal-form-toggle"
      );
      enableFoodsMealButtons(foodsMealButtons);
      onNewFoodsMealSubmit();
    }
  });
};

//update foods meal form with selected meal
const updateNewFoodsMealHTML = (form, foods, meal, foodsInMeal) => {
  const mealName = form.querySelector("#meal-name");
  const mealBody = form.querySelector(".meal-body");
  // grab new_foods_meal template
  const formTemplate = document.querySelector(
    "#new-foods-meal-template"
  ).content;

  mealName.innerHTML = meal.meal_name;

  foods.forEach((food) => {
    //clone templated form
    const foodForm = formTemplate
      .querySelector("#new-foods-meal-form")
      .cloneNode(true);

    const foodName = foodForm.querySelector(".food-name");
    const mealId = foodForm.querySelector("input[name='foods_meal[meal_id]']");
    const foodId = foodForm.querySelector("input[name='foods_meal[food_id]']");
    const sumbitButton = foodForm.querySelector("#submit-button");

    mealId.value = meal.id;
    foodId.value = food.id;
    foodName.innerHTML = `${food.food_name}`;
    if (foodsInMeal.some((item) => item.id === food.id)) {
      sumbitButton.classList.add("disabled");
    }
    mealBody.appendChild(foodForm);
  });
};

async function getFoods(mealId) {
  const response = await fetch(`/foods_meals/${mealId}/edit`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
    },
  });
  if (response.ok) {
    const data = await response.json();

    return data;
  }
}

const renderFormModal = (e) => {
  const timeOfDay = e.target.closest(".summary-table").dataset.tod;
  const formModalTemplate = document.querySelector(
    `#${timeOfDay}-form-modal-template`
  ).content;
  const formModal = formModalTemplate
    .querySelector("#form-modal")
    .cloneNode(true);
  document.querySelector("body").appendChild(formModal);
  onNewFoodSubmit();

  // close modal
  formModal.addEventListener("click", (e) => {
    if (e.target === formModal) {
      formModal.remove();
      location.reload();
    }
  });
};

const enableFoodsMealButtons = (buttons) => {
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      // toggle hidden class of new/edit meal forms
      buttons.forEach((button) => {
        const form = button.closest(".food-list");
        form.classList.toggle("hidden");
      });
    });
  });
};

const formModalTemplateButtons =
  document.querySelectorAll("#form-modal-toggle");

// display respective form modal when 'add food/meal' button clicked
formModalTemplateButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    renderFormModal(e);
    activateTabs();
  });
});

const onNewFoodsMealSubmit = () => {
  const newFoodsMealForms = document.querySelectorAll("#new-foods-meal-form");
  newFoodsMealForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      submitForm(e.target);
    });
  });
};

// handle new_foods_meal form submission
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
    updateFoodList(data.food_item, data.id);

    // disable 'Add food' button
    form.querySelector("#submit-button").classList.add("disabled");
  }
}

const updateCalorieSum = (data) => {
  const calsCounters = document.querySelectorAll("#sum-of-calories");
  calsCounters.forEach((calsCounter) => {
    calsCounter.textContent = `Total Cals:${data}`;
  });
};

// create a new meal-item node element containing new_foods_meal food
const updatedMealItemHTML = (food, foodsMealId) => {
  const mealItemTemplate = document.querySelector(
    "#meal-item-template"
  ).content;
  const mealItem = mealItemTemplate.querySelector(".meal-item").cloneNode(true);
  mealItem.dataset.id = `${foodsMealId}`;
  mealItem.querySelector(".meal-item-name").innerHTML = `${food.food_name}`;
  return mealItem;
};

//append every food item to edit_foods_meal page
const updateFoodList = (food, foodsMealId) => {
  const forms = document.querySelectorAll("#foods-meal-form");
  forms.forEach((form) => {
    if (form.dataset.formType === "edit") {
      form
        .querySelector(".meal-body")
        .appendChild(updatedMealItemHTML(food, foodsMealId));
      onClickRemoveFood(foodsMealId);
    }
  });
};

// function to remove food items from foods_meal page
const onClickRemoveFood = (foodsMealId) => {
  // grab 'remove food'
  const removeFoodButton = document.querySelector(`[data-id='${foodsMealId}']`);
  removeFoodButton.addEventListener("click", (e) => {
    const FoodsMealItem = e.target.closest(".meal-item");
    e.preventDefault();
    deleteFood(foodsMealId, FoodsMealItem);
    // remove disabled class on food item when item is removed
    const foodForms = document.querySelectorAll("#new-foods-meal-form");
    const removedFoodName = e.target
      .closest(".meal-item")
      .querySelector(".meal-item-name").textContent;
    foodForms.forEach((food) => {
      const foodName = food.querySelector(".food-name").textContent;
      if (foodName === removedFoodName) {
        food.querySelector("#submit-button").classList.remove("disabled");
      }
    });
  });
};

async function deleteFood(foodsMealId, object) {
  const response = await fetch(`/foods_meals/${foodsMealId}`, {
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

const enableCancelButton = () => {
  const buttons = document.querySelectorAll(".cancel-button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.target.closest("#foods-meal-form").classList.add("hidden");
      e.target
        .closest(".add-item-card")
        .querySelector("#meals-form")
        .classList.remove("hidden");
      getMeals();
    });
  });
};
const openCreateMealForm = () => {
  const newMealFormButton = document.querySelector(".new-meal-form-button");
  newMealFormButton.addEventListener("click", () => {
    const mealsForm = document.querySelector("#meals-form");
    const newMealForm = document.querySelector(".new-meal-form");
    mealsForm.classList.add("hidden");
    newMealForm.classList.remove("hidden");
    newMealFormButton.classList.add("hidden");
    onNewMealSubmit();
  });
};
const onNewMealSubmit = () => {
  const button = document.querySelector(".new-meal-form-submit");
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const form = e.target.closest("form");
    mealSubmit(form);
  });
};
async function mealSubmit(form) {
  const formData = new FormData(form);
  const response = await fetch("/meals", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
    },
    body: formData,
  });

  if (response.ok) {
    removeMealsForm();
    document.querySelector("#meals-form").classList.remove("hidden");
    getMeals();
  }
}
const removeMealsForm = () => {
  if (!document.querySelector(".new-meal-form").classList.contains("hidden"))
    document.querySelector(".new-meal-form").classList.add("hidden");
};
const clearMeals = () => {
  const mealsForm = document.querySelector("#meals-form");
  const meals = mealsForm.querySelectorAll("form");

  meals.forEach((meal) => {
    meal.remove();
  });
};

const onNewFoodSubmit = () => {
  const form = document.querySelector("#new-foods-form");
  const submitButton = form.querySelector(".new-food-submit-button");
  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    submitNewFoodForm(form);
  });
};

async function submitNewFoodForm(form) {
  const formData = new FormData(form);
  const response = await fetch("foods", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
    },
    body: formData,
  });

  if (response.ok) {
    const data = await response.json();

    // add food to page
    addFoodItem(data.food);
  }
}

const toggleNewFoodForm = (tab) => {
  const form = document.querySelector("#new-foods-form");
  if (tab.dataset.form !== "foods") {
    form.classList.add("hidden");
  } else if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
  }
};

const addFoodItem = (food) => {
  const foodTemplate = document.querySelector("#new-food-template").content;
  const foodItem = foodTemplate.querySelector("form").cloneNode(true);
  const foodName = foodItem.querySelector(".food-name");
  const foodCals = foodItem.querySelector(".food-calories");
  const foodProtein = foodItem.querySelector(".food-protein");
  const foodFats = foodItem.querySelector(".food-fats");
  const foodCarbs = foodItem.querySelector(".food-carbs");

  foodName.innerHTML = food.food_name;
  foodCals.innerHTML = `Cals.${food.calories}/`;
  foodProtein.innerHTML = `prot.${food.protein}/`;
  foodFats.innerHTML = `Fats.${food.fats}/`;
  foodCarbs.innerHTML = `Carbs.${food.carbs}`;

  const calsData = foodItem.querySelector('input[name="diary[calories]"]');
  calsData.value = food.calories;
  const proteinData = foodItem.querySelector('input[name="diary[protein]"]');
  proteinData.value = food.protein;
  const fatsData = foodItem.querySelector('input[name="diary[fats]"]');
  fatsData.value = food.fats;
  const carbsData = foodItem.querySelector('input[name="diary[carbs]"]');
  carbsData.value = food.carbs;

  const foodId = foodItem.querySelector('input[name="diary[food_id]"]');
  foodId.value = food.id;

  document.querySelector(".food-body").appendChild(foodItem);
};
