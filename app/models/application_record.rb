class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  def remove_nil
    if !self.calories
      self.calories = 0
    end
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

  def foods_macro_sum_with_servings(macro)
    sum = 0
    self.foods_meals.each do |fm|
      food = Food.find(fm.food_id)
      sum += food.send(macro) * fm.servings
    end
    sum
  end
end
