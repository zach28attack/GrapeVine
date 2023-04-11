class Diary < ApplicationRecord
belongs_to :user

validates :calories, presence: true, numericality: { only_integer: true }
validates :protein, numericality: { only_integer: true }, allow_blank: true
validates :fats, numericality: { only_integer: true }, allow_blank: true
validates :carbs, numericality: { only_integer: true }, allow_blank: true
end