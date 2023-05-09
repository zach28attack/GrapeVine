require 'rails_helper'

RSpec.describe Food, type: :model do
  let(:user) { FactoryBot.create(:user)}
  let(:food) { FactoryBot.create(:food, user_id: user.id) }
  def expect_invalid_with_invalid_data_type(attribute, value)
    food.send("#{attribute}=", value)
    expect(food).to_not be_valid
  end

  context "with valid attributes" do
    it "should be valid" do 
      expect(food).to be_valid
    end
  end

  describe "with invalid attributes" do
    context "with nil food_name" do
      it "should be invalid" do 
        food.food_name = nil
        expect(food).to_not be_valid
      end
    end
    context "with nil calories" do
      it "should be invalid" do 
        food.calories = nil
        expect(food).to_not be_valid
      end
    end
    context "with nil user" do
      it "should be invalid" do 
        food.user_id = nil
        expect(food).to_not be_valid
      end
    end
  end

  describe "with wrong data type" do
    it "should be invalid with calories" do 
      expect_invalid_with_invalid_data_type('calories', 'words')
    end
    it "should be invalid with protein" do 
      expect_invalid_with_invalid_data_type('protein', 'words')
    end
    it "should be invalid with fats" do 
      expect_invalid_with_invalid_data_type('fats', 'words')
    end
    it "should be invalid with carbs" do 
      expect_invalid_with_invalid_data_type('carbs', 'words')
    end
  end
end
