class Diary < ApplicationRecord
belongs_to :user
belongs_to :meal, optional:true
belongs_to :food, optional:true

validates :calories, presence: true, numericality: { only_integer: true }
validates :protein, numericality: { only_integer: true }, allow_blank: true
validates :fats, numericality: { only_integer: true }, allow_blank: true
validates :carbs, numericality: { only_integer: true }, allow_blank: true

  def remove_nil
    if !self.protein
      self.protein = 0
    end
    if !self.carbs
      self.carbs = 0
    end
    if !self.fats
      self.fats=0
    end
  end
end