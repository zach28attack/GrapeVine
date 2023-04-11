class User < ApplicationRecord
has_many :diaries, class_name: "Diary"
has_many :foods, class_name: "Food"
has_many :meals, class_name: "Meal"
has_many :foods_meals

end