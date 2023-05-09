FactoryBot.define do
  factory :diary do
    calories {500}
    protein {100}
    fats {80}
    carbs {60}
    servings {1}
    time_of_day {"Breakfast"}
  end
end
