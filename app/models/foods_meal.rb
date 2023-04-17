class FoodsMeal < ApplicationRecord
  belongs_to :meal
  belongs_to :food
  belongs_to :user
  validates_uniqueness_of :food_id, scope: :meal_id
  
end