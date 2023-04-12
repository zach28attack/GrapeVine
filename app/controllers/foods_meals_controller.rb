class FoodsMealsController < ApplicationController

  def new
    @meal = Meal.find(params[:meal_id])
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
    if @foods_meal.save
      redirect_to new_foods_meal_path(meal_id: params[:meal_id])
    else
      render :new
    end
  end


  def edit
    
  end


  def update
    
  end


  def destroy
    
  end

  private

  def foods_meals_params
    params.require(:foods_meal).permit(:meal_id, :food_id)
  end
  

end