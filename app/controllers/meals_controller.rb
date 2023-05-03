class MealsController < ApplicationController
  before_action :authenticate_user!
 
  def index
    meals_array = []
    current_user.meals.each do |meal|
      meals_array << {
        meal: meal,
        calories: meal.foods_macro_sum_with_servings('calories'),
        protein: meal.foods_macro_sum_with_servings('protein'),
        fats: meal.foods_macro_sum_with_servings('fats'),
        carbs: meal.foods_macro_sum_with_servings('carbs')
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
