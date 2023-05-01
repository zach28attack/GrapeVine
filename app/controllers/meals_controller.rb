class MealsController < ApplicationController
  before_action :authenticate_user!
 
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

  def create
    @meal = Meal.new(meal_param)
    @meal.user_id = current_user.id
    if @meal.save
      render json: { status: 'success' }, status: :ok
    else
      render json: {status: 'error'}, status: :unprocessable_entity
    end
  end

  def destroy
    meal = Meal.find(params[:id])
    if meal.destroy
      render json: {status: 'success'}, status: :ok
    else
      render json: {status: 'error'}, status: :unprocessable_entity
    end
  end

  private

  def meal_param
    params.require(:meal).permit(:meal_name)
  end
end
