Rails.application.routes.draw do
  devise_for :users
  resources :users, only: %i[show]
  resources :diaries
  resources :meals
  resources :foods
  resources :foods_meals

  root "diaries#index"
  
end
