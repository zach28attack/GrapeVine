require 'rails_helper'

RSpec.describe "Diaries", type: :system do
  before do
    driven_by :selenium_chrome, using: :chrome
  end
end
