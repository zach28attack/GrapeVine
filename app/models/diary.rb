class Diary < ApplicationRecord
belongs_to :user
belongs_to :meal, optional:true
belongs_to :food, optional:true

validates :calories, presence: true, numericality: { only_integer: true, greater_than: 0 }
validates :protein, numericality: { only_integer: true }, allow_blank: true
validates :fats, numericality: { only_integer: true }, allow_blank: true
validates :carbs, numericality: { only_integer: true }, allow_blank: true

  
end