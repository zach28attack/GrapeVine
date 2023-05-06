class Meal < ApplicationRecord
  belongs_to :user
  has_many :foods_meals, dependent: :destroy
  has_many :foods , through: :foods_meals, class_name: "Food"
  has_many :diaries

  validates :meal_name, presence: true
end