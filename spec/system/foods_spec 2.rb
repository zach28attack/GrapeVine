require 'rails_helper'

def log_in(user)
  visit new_user_session_path
  fill_in "Email", with: user.email
  fill_in "Password", with: user.password
  find('input[name="commit"]').click
end

RSpec.describe "Foods", type: :system do
  let(:user) {FactoryBot.create(:user)}
  before do
    driven_by :selenium_chrome, using: :chrome
    user
    log_in(user)
  end

  describe "creating a new food" do
    context "with valid attributes"  do
      it "should create new food" do 
        visit root_path
        find("[data-tod='Breakfast']").click_on("Add food/meal")
        sleep 0.5
      end
    end
  end
end
