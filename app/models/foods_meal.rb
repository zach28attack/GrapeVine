class FoodsMeal < ApplicationRecord
belongs_to :meal
belongs_to :food
belongs_to :user
end