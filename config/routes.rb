Rails.application.routes.draw do
  resources :diaries
  resources :users
  resources :meals
  resources :foods
  resources :foods_meals

  root "diaries#index"
end
