class WeightLog < ApplicationRecord
  validates :log, presence: true, numericality: {only_integer: true}
  belongs_to :user
end
