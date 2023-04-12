class MealsController < ApplicationController
  def new
    @meal = Meal.new
  end
  
  def index
    
  end

  def show
    
  end

  def create
    @meal = Meal.new(meal_param)
    @meal.user_id = 1
    if @meal.save
      redirect_to new_foods_meal_path(meal_id: @meal.id)
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

  def meal_param
    params.require(:meal).permit(:meal_name)
  end
end
