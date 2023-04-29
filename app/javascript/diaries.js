// Call diariesIndexJS when the page is shown
window.addEventListener("pageshow", () => {
  diariesIndexJS();
});

// refactored functions
const documentBody = document.querySelector("body");

// main function handles diary summary page
const diariesIndexJS = () => {
  const formModalTemplateButtons = document.querySelectorAll("#form-modal-toggle");

  // display form modal when 'add food/meal' button clicked
  formModalTemplateButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      renderFormModal(e);
      activateTabs();
    });
  });

  const diaryFormToggles = document.querySelectorAll("#diary-form-toggle");
  const getTimeOfDay = (e) => {
    return e.target.closest("#time-of-day").dataset.tod.toLowerCase();
  };

  // add event listeners to quick add buttons
  diaryFormToggles.forEach((formToggle) => {
    formToggle.addEventListener("click", (e) => {
      // select time of day from data set in summary card to choose correct form template
      const timeOfDay = getTimeOfDay(e);
      const diaryFormTemplate = document.querySelector(`#${timeOfDay}-diary-form-template`).content;
      const diaryFormModal = diaryFormTemplate.querySelector(".diary-form-modal").cloneNode(true);

      // add form to page and add event listener to close
      documentBody.appendChild(diaryFormModal);
      diaryFormModal.addEventListener("click", (e) => {
        if (e.target === diaryFormModal) {
          diaryFormModal.remove();
        }
      });
    });
  });

  // Close the modal form when the user presses the Escape key.
  document.addEventListener("keypress", (e) => {
    // Check if the Escape key was pressed and a diary form modal is open.
    if (e.key === "Escape" && document.querySelector("body").contains(document.querySelector(".diary-form-modal"))) {
      // If so, remove the modal form.
      document.querySelector(".diary-form-modal").remove();
    }
    // Check if the Escape key was pressed and a food list form modal is open.
    else if (
      e.key === "Escape" &&
      document.querySelector("body").contains(document.querySelector("#food-list-form-modal"))
    ) {
      // If so, remove the food list form modal.
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
    } else {
      console.error("Error");
    }
  }

  const mealsHTML = (data) => {
    const mealBody = document.querySelector("#meals-form").querySelector(".meal-body");
    const mealTemplate = mealBody.querySelector("#meal-template").content;
    const mealsArray = data.meals;
    mealsArray.forEach((mealObj) => {
      // clone meal form node
      const mealNode = mealTemplate.querySelector("form").cloneNode(true);

      // get meal hidden form fields
      const mealCalInput = mealNode.querySelector("input[name='diary[calories]']");
      const mealProteinInput = mealNode.querySelector("input[name='diary[protein]']");
      const mealFatsInput = mealNode.querySelector("input[name='diary[fats]']");

      const mealCarbInput = mealNode.querySelector("input[name='diary[carbs]']");
      const mealIdInput = mealNode.querySelector("input[name='diary[meal_id]']");

      // get form elements
      const mealName = mealNode.querySelector(".meal-item-name");
      const mealItemId = mealNode.querySelector(".meal-item");
      const mealFatsSum = mealNode.querySelector("#meal-fats-sum");
      const mealCarbSum = mealNode.querySelector("#meal-carbs-sum");
      const mealProteinSum = mealNode.querySelector("#meal-protein-sum");
      const mealCalSum = mealNode.querySelector("#meal-cal-sum");

      // assign value to hidden fields
      mealIdInput.value = mealObj.meal.id;
      mealItemId.dataset.id = mealObj.meal.id;
      mealCalInput.value = mealObj.calories;
      mealFatsInput.value = mealObj.fats;
      mealProteinInput.value = mealObj.protein;
      mealCarbInput.value = mealObj.carbs;

      //  insert html into elements
      mealCarbSum.innerHTML = `Carbs. ${mealObj.carbs}`;
      mealName.innerHTML = mealObj.meal.meal_name;
      mealCalSum.innerHTML = `Cals. ${mealObj.calories}/`;
      mealFatsSum.innerHTML = ` Fats ${mealObj.fats}/`;
      mealProteinSum.innerHTML = ` Prot. ${mealObj.protein}/`;

      // append meal form node into body of the meal body div
      mealBody.appendChild(mealNode);
      onEditMealClick(mealNode);
    });
  };

  // Render a new foods_meal form when the edit meal button is clicked.
  // `mealNode` is a DOM element representing the meal item.
  const onEditMealClick = (mealNode) => {
    const editMealButton = mealNode.querySelector(".meal-edit-button");

    // Add a click event listener to the edit meal button.
    editMealButton.addEventListener("click", async (e) => {
      enableCancelButton();
      // Get the meal ID from the closest meal item element's data attribute.
      const mealId = e.target.closest(".meal-item").dataset.id;
      e.preventDefault();

      // Get the meal's food data from the API.
      const data = await getFoods(mealId);

      // Remove any existing new-foods-meal forms from the page.
      const customHTMLForms = document.querySelectorAll("#new-foods-meal-form");
      customHTMLForms.forEach((form) => {
        form.remove();
      });

      // Render a new new-foods-meal form with the meal's food data.
      renderNewFoodsMealForm(data);

      // Update the calorie sum displayed in the form.
      updateCalorieSum(data.sum_of_calories);

      // Iterate through the array of foods_meal objects with the current meal ID to update the food list.
      data.foods_meals.forEach((foodsMeal) => {
        data.foods_in_meal.forEach((food) => {
          if (foodsMeal.food_id === food.id) {
            updateFoodList(food, foodsMeal.id);
          }
        });
      });
    });
  };

  // render foods_meal form partial
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

      // render new partial
      if (form.id === "foods-meal-form" && form.dataset.formType === undefined) {
        form.classList.remove("hidden");
        updateNewFoodsMealHTML(form, foods, meal, foodsInMeal);

        // add event listeners to foods_meal forms to toggle new/edit forms
        const foodsMealButtons = document.querySelectorAll("#foods-meal-form-toggle");
        enableFoodsMealButtons(foodsMealButtons);
        onNewFoodsMealSubmit();
      }
    });
  };

  //update foods meal form with selected meal
  const updateNewFoodsMealHTML = (form, foods, meal, foodsInMeal) => {
    const mealNames = document.querySelectorAll("#meal-name");
    const mealBody = form.querySelector(".meal-body");

    // grab new_foods_meal template
    const formTemplate = document.querySelector("#new-foods-meal-template").content;

    // update meal name in form
    mealNames.forEach((mealName) => [(mealName.innerHTML = meal.meal_name)]);

    // for each food, clone form template, update values, and append to form
    foods.forEach((food) => {
      const foodForm = formTemplate.querySelector("#new-foods-meal-form").cloneNode(true);
      const foodName = foodForm.querySelector(".food-name");
      const mealId = foodForm.querySelector("input[name='foods_meal[meal_id]']");
      const foodId = foodForm.querySelector("input[name='foods_meal[food_id]']");
      const submitButton = foodForm.querySelector("#submit-button");

      mealId.value = meal.id;
      foodId.value = food.id;
      foodName.innerHTML = `${food.food_name}`;

      // disable submit button if food is already in meal
      if (foodsInMeal.some((item) => item.id === food.id)) {
        submitButton.classList.add("disabled");
      }

      mealBody.appendChild(foodForm);
    });
  };

  // get lis of foods associated with mealId
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
    } else {
      console.error("Error");
    }
  }

  // Render form modal for adding a new food to a meal
  const renderFormModal = (e) => {
    // Get time of day from closest ancestor element with "summary-table" class
    const timeOfDay = e.target.closest(".summary-table").dataset.tod;

    // Get form modal template from HTML document
    const formModalTemplate = document.querySelector(`#${timeOfDay}-form-modal-template`).content;

    // Clone form modal template to create a new instance of the modal
    const formModal = formModalTemplate.querySelector("#form-modal").cloneNode(true);

    // Add the new form modal to the document body
    documentBody.appendChild(formModal);

    // Add event listeners for form submission
    onNewFoodSubmit();

    // Close modal when user clicks outside of it
    formModal.addEventListener("click", (e) => {
      if (e.target === formModal) {
        formModal.remove();
      }
    });
  };

  // This function enables the switching of new/edit foods_meal form partials
  const enableFoodsMealButtons = (buttons) => {
    // Loop through all provided buttons
    buttons.forEach((button) => {
      // Add event listener to each button for when clicked
      button.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent the default behavior of the clicked button

        // Toggle the hidden class of new/edit meal forms for all buttons
        buttons.forEach((button) => {
          const form = button.closest(".food-list"); // Get the closest ancestor element with the class "food-list"
          form.classList.toggle("hidden"); // Toggle the "hidden" class of the form
        });
      });
    });
  };

  const onNewFoodsMealSubmit = () => {
    // Get all elements with the ID "new-foods-meal-form"
    const newFoodsMealForms = document.querySelectorAll("#new-foods-meal-form");

    // Loop through each form and add event listener for "submit" event
    newFoodsMealForms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the default behavior of the form when submitted
        submitForm(e.target); // Call the submitForm function and pass in the target of the event (the form)
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
    } else {
      console.error("Error");
    }
  }

  const updateCalorieSum = (data) => {
    // Get all elements with the ID "sum-of-calories"
    const calsCounters = document.querySelectorAll("#sum-of-calories");

    // Loop through each element and update its text content
    calsCounters.forEach((calsCounter) => {
      calsCounter.textContent = `Total Cals:${data}`; // Set the text content of the element to the data passed in, prepended with "Total Cals:"
    });
  };

  // create a new meal-item node element containing new_foods_meal food
  const updatedMealItemHTML = (food, foodsMealId) => {
    const mealItemTemplate = document.querySelector("#meal-item-template").content;
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
        form.querySelector(".meal-body").appendChild(updatedMealItemHTML(food, foodsMealId));
        onClickRemoveFood(foodsMealId);
      }
    });
  };

  // This function removes food items from foods_meal page
  const onClickRemoveFood = (foodsMealId) => {
    // Get the 'remove food' button with the specified data-id attribute
    const removeFoodButton = document.querySelector(`[data-id='${foodsMealId}']`);

    // Add event listener to the 'remove food' button for when clicked
    removeFoodButton.addEventListener("click", (e) => {
      // Get the closest ancestor element with the class "meal-item"
      const FoodsMealItem = e.target.closest(".meal-item");

      // Check if the clicked element has an ID of "remove-food-button"
      if (e.target.id === "remove-food-button") {
        e.preventDefault(); // Prevent the default behavior of the clicked button

        // Call the deleteFood function and pass in the foodsMealId and FoodsMealItem as arguments
        deleteFood(foodsMealId, FoodsMealItem);

        // Remove the "disabled" class on food item when item is removed
        const foodForms = document.querySelectorAll("#new-foods-meal-form");
        const removedFoodName = e.target.closest(".meal-item").querySelector(".meal-item-name").textContent;

        // Loop through each food form and check if the food name matches the removed food name
        foodForms.forEach((food) => {
          const foodName = food.querySelector(".food-name").textContent;
          if (foodName === removedFoodName) {
            food.querySelector("#submit-button").classList.remove("disabled"); // Remove the "disabled" class from the submit button of the matched food form
          }
        });
      }
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

  let hasGetMealsEventListener = "false";
  // This function enables cancel buttons for the food item form
  const enableCancelButton = () => {
    // Get all elements with the class "cancel-button"
    const buttons = document.querySelectorAll(".cancel-button");

    // Add event listener to each "cancel-button" element for when clicked
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent the default behavior of the clicked button

        // Get the closest ancestor element with the ID "foods-meal-form" and add the "hidden" class
        e.target.closest("#foods-meal-form").classList.add("hidden");

        // Get the closest ancestor element with the class "add-item-card" and find the element with the ID "meals-form", then remove the "hidden" class
        e.target.closest(".add-item-card").querySelector("#meals-form").classList.remove("hidden");

        if (!hasGetMealsEventListener) {
          // Call the getMeals function to get the updated meals list
          getMeals();
          hasGetMealsEventListener = "true";
        }
      });
    });
  };

  // This function opens the create meal form
  const openCreateMealForm = () => {
    // Get the element with the class "new-meal-form-button"
    const newMealFormButton = document.querySelector(".new-meal-form-button");

    // Add event listener to "new-meal-form-button" element for when clicked
    newMealFormButton.addEventListener("click", () => {
      // Get the element with the ID "meals-form" and add the "hidden" class
      const mealsForm = document.querySelector("#meals-form");
      mealsForm.classList.add("hidden");

      // Get the element with the class "new-meal-form" and remove the "hidden" class
      const newMealForm = document.querySelector(".new-meal-form");
      newMealForm.classList.remove("hidden");

      // Add the "hidden" class to the "new-meal-form-button" element
      newMealFormButton.classList.add("hidden");

      // Call the onNewMealSubmit function to submit the new meal form
      onNewMealSubmit();
    });
  };

  // This function listens for submission of the new meal form and calls the mealSubmit function
  const onNewMealSubmit = () => {
    // Get the element with the class "new-meal-form-submit"
    const button = document.querySelector(".new-meal-form-submit");

    // Add event listener to "new-meal-form-submit" element for when clicked
    button.addEventListener("click", (e) => {
      e.preventDefault();
      // Get the closest form element to the clicked button
      const form = e.target.closest("form");

      // Call the mealSubmit function with the form as the argument
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
    } else {
      console.error("Error");
    }
  }
  // This function removes the new meal form if it is not hidden
  const removeMealsForm = () => {
    if (!document.querySelector(".new-meal-form").classList.contains("hidden")) {
      document.querySelector(".new-meal-form").classList.add("hidden");
    }
  };

  // This function removes all meal forms in the meals section
  const clearMeals = () => {
    const mealsFormBody = document.querySelector("#meals-form");
    const forms = mealsFormBody.querySelectorAll("form");

    forms.forEach((form) => {
      form.remove();
    });
  };

  // Define a function that handles the submission of a new food
  const onNewFoodSubmit = () => {
    // Get the form element with the id "new-foods-form"
    const form = document.querySelector("#new-foods-form");
    // Get the submit button element inside the form
    const submitButton = form.querySelector(".new-food-submit-button");
    // Add a click event listener to the submit button
    submitButton.addEventListener("click", (e) => {
      // Prevent the default form submission behavior
      e.preventDefault();
      // Call the submitNewFoodForm function with the form element as an argument
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
      clearFoodForm(form);
    } else {
      console.error("Error");
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

  // Define a function that adds a new food item to the food diary
  const addFoodItem = (food) => {
    // Get the food template from the DOM
    const foodTemplate = document.querySelector("#new-food-template").content;
    // Clone the template to create a new food item
    const foodItem = foodTemplate.querySelector("form").cloneNode(true);
    // Get the various elements inside the food item form
    const foodName = foodItem.querySelector(".food-name");
    const foodCals = foodItem.querySelector(".food-calories");
    const foodProtein = foodItem.querySelector(".food-protein");
    const foodFats = foodItem.querySelector(".food-fats");
    const foodCarbs = foodItem.querySelector(".food-carbs");

    // Set the text content of the food name and macronutrient elements
    foodName.innerHTML = food.food_name;
    foodCals.innerHTML = `Cals.${food.calories}/`;
    foodProtein.innerHTML = `prot.${food.protein}/`;
    foodFats.innerHTML = `Fats.${food.fats}/`;
    foodCarbs.innerHTML = `Carbs.${food.carbs}`;

    // Set the value of the various input elements inside the food item form
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

    // Append the new food item to the "food-body" element in the DOM
    document.querySelector(".food-body").appendChild(foodItem);
  };

  // Define a function that clears the values of a food form
  const clearFoodForm = (form) => {
    // Get the various input elements in the form and set their values to an empty string
    const foodName = form.querySelector("#food_food_name");
    foodName.value = "";

    const foodCals = form.querySelector("#food_calories");
    foodCals.value = "";

    const foodProtein = form.querySelector("#food_protein");
    foodProtein.value = "";

    const foodFats = form.querySelector("#food_fats");
    foodFats.value = "";

    const foodCarbs = form.querySelector("#food_carbs");
    foodCarbs.value = "";
  };
};
