class Food < ApplicationRecord
belongs_to :user
has_and_belongs_to_many :meals
has_many :diaries

validates :food_name, presence: true
validates :calories, presence: true, numericality: { only_integer: true }
validates :protein, allow_blank: true, numericality: { only_integer: true }
validates :fats, allow_blank: true, numericality: { only_integer: true }
validates :carbs, allow_blank: true, numericality: { only_integer: true }

end