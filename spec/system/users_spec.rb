require 'rails_helper'

def sign_up(email, password, password2)
  visit new_user_registration_path
  fill_in "Email", with: email
  fill_in "Password", with: password
  fill_in "Password confirmation", with: password2
  find('input[name="commit"]').click
end

def log_in(user)
  visit new_user_session_path
  fill_in "Email", with: user.email
  fill_in "Password", with: user.password
  find('input[name="commit"]').click
end

RSpec.describe "Users", type: :system do

  let(:user) {FactoryBot.create(:user)}

  before do
    driven_by :selenium_chrome, using: :chrome
  end

  describe "sign-up" do
    context "with valid attributes" do
      it "should create new user" do 
        expect{
          sign_up("newEmail@gmail.com", "password123", "password123")
          sleep 0.1
        }.to change(User, :count).by(1)
      end
    end

    context "with mismatch passwords" do
      it "should disable button" do 
        expect{
          sign_up("newEmail@gmail.com", "password123", "password")
          sleep 0.1
        }.to_not change(User, :count)
      end
    end
  end

  describe "Log-in" do
    context "with correct credentials" do
      it "should log in" do 
        user
        log_in(user)
        sleep 0.1
        expect(page).to have_current_path(root_path)
      end
    end
  end

  describe "After logging in" do
    context "clicking 'Profile' link in navbar" do
      it "should route to progress page" do 
        user
        log_in(user)
        click_on "Profile"
        expect(page).to have_current_path(weight_logs_path)
      end
    end

    context "From progress page clicking 'Account'" do
      it "should route to user edit" do 
        user
        log_in(user)
        click_on "Profile"
        click_on "Account"
        expect(page).to have_current_path(edit_user_registration_path(user))
      end
    end

    context "From account page clicking 'Delete' button" do
      it "should delete user" do
        user
        expect{ 
        log_in(user)
        click_on "Profile"
        click_on "Account"
        click_on "Delete"
        sleep 0.1
        }.to change(User, :count).by(-1)
      end
    end
  end
end
