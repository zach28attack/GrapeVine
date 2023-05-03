class AddServingsToFoodsMeals < ActiveRecord::Migration[7.0]
  def change
    add_column :foods_meals, :servings, :integer, default: 1
  end
end
