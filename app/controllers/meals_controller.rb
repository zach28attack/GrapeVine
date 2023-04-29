class MealsController < ApplicationController
  before_action :authenticate_user!
  
  def new
    @meal = Meal.new
  end
  
  def index
    meals_array = []
    current_user.meals.each do |meal|
      meals_array << {
        meal: meal,
        calories: meal.foods.sum(:calories),
        protein: meal.foods.sum(:protein),
        fats: meal.foods.sum(:fats),
        carbs: meal.foods.sum(:carbs)
      }
    end
    
    render json: { meals: meals_array.reverse! }
  end

  def show
    
  end

  def create
    @meal = Meal.new(meal_param)
    @meal.user_id = current_user.id
    if @meal.save
      render json: { status: 'success' }, status: :ok
    else
      render json: {status: 'error'}, status: :unprocessable_entity
    end
  end

  def edit
    
  end

  def update
    
  end

  def destroy
    
  end

  private

  def meal_param
    params.require(:meal).permit(:meal_name)
  end
end
