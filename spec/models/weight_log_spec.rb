require 'rails_helper'

RSpec.describe WeightLog, type: :model do
  let(:user) {FactoryBot.create(:user)}
  let(:weight_log) {FactoryBot.create(:weight_log, user_id: user.id)}

  context "with valid attributes" do
    it "should be valid" do 
      expect(weight_log).to be_valid
    end
  end
  
  context "with nil log" do
    it "should be invalid" do 
      weight_log.log = nil
      expect(weight_log).to_not be_valid
    end
  end
  context "with nil user" do
    it "should be invalid" do 
      weight_log.user_id = nil
      expect(weight_log).to_not be_valid
    end
  end
end
