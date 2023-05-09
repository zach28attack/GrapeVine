require 'rails_helper'

RSpec.describe Meal, type: :model do
  let(:user) { FactoryBot.create(:user)}
  let(:meal) { FactoryBot.create(:meal, user_id: user.id)}

  context "with valid attributes" do
    it "should be valid" do 
      expect(meal).to be_valid
    end
  end

  context "with nil user" do
    it "should be invalid" do 
      meal.user_id = nil
      expect(meal).to_not be_valid
    end
  end

  context "with nil meal name" do
    it "should be invalid" do 
      meal.meal_name = nil
      expect(meal).to_not be_valid
    end
  end
end
