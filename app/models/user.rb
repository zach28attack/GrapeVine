class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :diaries, class_name: "Diary"
  has_many :foods, class_name: "Food"
  has_many :meals, class_name: "Meal"
  has_many :foods_meals
  has_many :weight_logs
end