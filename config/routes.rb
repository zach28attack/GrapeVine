Rails.application.routes.draw do
  root "diaries#index"
  
  resources :diaries, only: %i[ index create destroy]
  resources :foods
  resources :foods_meals
  resources :meals
  devise_for :users
  resources :users, only: %i[show]
  resources :weight_logs
  
  
  
end
