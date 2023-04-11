class CreateFoodsMeals < ActiveRecord::Migration[7.0]
  def change
    create_table :foods_meals do |t|
      t.belongs_to :meal, index: true
      t.belongs_to :food, index: true
      t.belongs_to :user, index: true
      t.timestamps
    end
  end
end
