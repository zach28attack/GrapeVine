require 'rails_helper'

RSpec.describe "Users", type: :system do
  before do
    driven_by :selenium_chrome, using: :chrome
  end

  describe "sign-up" do
    context "with valid attributes" do
      it "should create new user" do 
        expect{
          print User.count
          visit new_user_registration_path
          fill_in "Email", with: "newEmail@gmail.com"
          fill_in "Password", with: "password123"
          fill_in "Password confirmation", with: "password123"
          button = find('input[name="commit"]')
          button.click
          print User.count

        }.to change(User, :count).by(1)
      end
    end
  end
end
