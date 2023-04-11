class FoodsMeal < ApplicationRecord
has_many :meals
has_many :foods
belongs_to :user
end