Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  resources :diaries
  resources :foods
  resources :users
  resources :meals
  resources :foods_meals

  root "diaries#index"
end
