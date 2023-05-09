require 'rails_helper'

RSpec.describe FoodsMeal, type: :model do
  let(:user) { FactoryBot.create(:user) }
  let(:meal) { FactoryBot.create(:meal, user_id: user.id) }
  let(:food) { FactoryBot.create(:food, user_id: user.id) }
  let(:foods_meal) { FactoryBot.create(:foods_meal, user_id: user.id, meal_id: meal.id, food_id: food.id) }


  describe "with nil id" do

    context "of user" do
      it "should be invalid" do 
        foods_meal.user_id = nil
        expect(foods_meal).to_not be_valid
      end
    end
    
    context "of meal" do
      it "should be invalid" do 
        foods_meal.meal_id = nil
        expect(foods_meal).to_not be_valid
      end
    end

    context "of food" do
      it "should be invalid" do 
        foods_meal.food_id = nil
        expect(foods_meal).to_not be_valid
      end
    end
  end

  context "with duplicate foods" do
    it "should be invalid" do 
      foods_meal
      foods_meal2 = foods_meal.dup
      expect(foods_meal2).to_not be_valid
    end
  end
end
