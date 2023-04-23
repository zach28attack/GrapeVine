class MealsController < ApplicationController
  def new
    @meal = Meal.new
  end
  
  def index
    meals_array = []
    meals = Meal.all
    # @diary = Diary.new

    meals.each do |meal|
      meals_array << {
        meal: meal,
        calories: meal.foods.sum(:calories),
        protein: meal.foods.sum(:protein),
        fats: meal.foods.sum(:fats),
        carbs: meal.foods.sum(:carbs)
      }
    end
    
    render json: { meals: meals_array }
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
