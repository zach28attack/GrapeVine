module FoodsMealsHelper
  def get_foods_meal_id(food_id, meal_id)
    foods_meal = FoodsMeal.find_by(food_id: food_id, meal_id: meal_id)
    foods_meal.id
  end
end