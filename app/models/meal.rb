class Meal < ApplicationRecord
belongs_to :user
has_and_belongs_to_many :foods
has_many :diaries

end