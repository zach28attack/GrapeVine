class Food < ApplicationRecord
belongs_to :user
has_many :foods_meals, dependent: :destroy
has_many :meals, through: :foods_meals, class_name: "Meal"
has_many :diaries

validates :food_name, presence: true
validates :calories, presence: true, numericality: { only_integer: true }
validates :protein, allow_blank: true, numericality: { only_integer: true }
validates :fats, allow_blank: true, numericality: { only_integer: true }
validates :carbs, allow_blank: true, numericality: { only_integer: true }


end