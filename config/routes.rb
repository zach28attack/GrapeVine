Rails.application.routes.draw do
  root "diaries#index"

  resources :diaries, only: %i[ index create destroy]
  resources :foods, only: %i[create destroy]
  resources :foods_meals, only: %i[create edit destroy]
  resources :meals, only: %i[index create edit update destroy]
  devise_for :users
  resources :users, only: %i[show]
  resources :weight_logs, only: %i[index create destroy]

end
