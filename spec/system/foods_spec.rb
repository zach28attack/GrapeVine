require 'rails_helper'

RSpec.describe "Foods", type: :system do
  before do
    driven_by :selenium_chrome, using: :chrome
  end

  pending "add some scenarios (or delete) #{__FILE__}"
end
