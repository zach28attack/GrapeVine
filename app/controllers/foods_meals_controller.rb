class FoodsMealsController < ApplicationController

  def new
    @meal = params[:meal_id] ?  Meal.find(params[:meal_id]) : Meal.new
    @foods_meal = FoodsMeal.new
    @foods = Food.all
  end


  def index
    
  end


  def show
    
  end


  def create
    @foods_meal = FoodsMeal.new(foods_meals_params)
    @foods_meal.user_id = 1
    food = Food.find(@foods_meal.food_id)
    if @foods_meal.save
      # Return the updated data as JSON
      render json: { status: 'success', data: sum_of_calories, food_item: food }, status: :ok
    else
      # Return an error message as JSON
      render json: { status: 'error', message: 'Save failed' }, status: :unprocessable_entity
    end
  end


  def edit
    @meal = Meal.find(params[:id])
  end


  def update
    
  end


  def destroy
    @foods_meal = FoodsMeal.find(params[:id])
    # meal_id = foods_meal.meal_id
    if @foods_meal.destroy
      render json: { status: 'success', data: sum_of_calories }, status: :ok
    else
      render json: { status: 'error', message: 'Delete failed' }, status: :unprocessable_entity
    end
  end

  private

  def foods_meals_params
    params.require(:foods_meal).permit(:meal_id, :food_id)
  end

  def sum_of_calories
    meal = Meal.find(@foods_meal.meal_id)
    meal.foods.sum(:calories)
  end
end