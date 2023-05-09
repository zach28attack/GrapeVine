require 'rails_helper'

RSpec.describe Diary, type: :model do
  let(:user) { FactoryBot.create(:user)}
  let(:diary) { FactoryBot.create(:diary, user_id: user.id) }

  def expect_invalid_with_invalid_data_type(attribute, value)
    diary.send("#{attribute}=", value)
    expect(diary).to_not be_valid
  end

  context "with valid attributes" do
    it "should be valid" do 
      expect(diary).to be_valid
    end
  end

  describe "with invalid attributes" do
    context "with nil user" do
      it "should be invalid" do 
        diary.user_id = nil
        expect(diary).to_not be_valid
      end
    end

    context "with nil caloires" do
      it "should be invalid" do 
        diary.calories = nil
        expect(diary).to_not be_valid
      end
    end

    context "with invalid data-type" do
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
end
