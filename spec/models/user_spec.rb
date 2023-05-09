require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) {FactoryBot.create(:user)}

  context "with valid attributes" do
    it "should be valid" do 
      expect(user).to be_valid
    end
  end

  context "with invalid email" do
    it "should be valid" do 
      user.email = "testing"
      expect(user).to_not be_valid
    end
  end

  context "with invalid password" do
    it "should be valid" do 
      user.password = "1234"
      expect(user).to_not be_valid
    end
  end
end
