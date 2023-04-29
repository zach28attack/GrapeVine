Rails.application.routes.draw do
  devise_for :users
  resources :users, only: %i[show]
  resources :diaries, only: %i[ index create destroy]
  resources :meals
  resources :foods
  resources :foods_meals
  resources :weight_logs
  
  root "diaries#index"
  
end
