class DiariesController < ApplicationController
  before_action :authenticate_user!

  def index
    # May 1st.yday == 121
    @date = params[:date].to_i
    @date = Date.today.yday if @date == 0
    @todays_date = Date.today.yday
    init_diary(@date)

    # variables for sumary tables
    @diaries = current_user.diaries.select{ |diary| diary.date.yday == @date }
    
    @breakfast_diaries = @diaries.select { |diary| diary.time_of_day == "Breakfast" }
    @lunch_diaries = @diaries.select { |diary| diary.time_of_day == "Lunch" }
    @dinner_diaries = @diaries.select { |diary| diary.time_of_day == "Dinner" }
    @diary = Diary.new
    
    # variables for form modal
    @foods = current_user.foods
    @meals = current_user.meals
    @meal = Meal.new
    @foods_meal = FoodsMeal.new
    @food = Food.new
  
    # variables for summary total piechart
    total_calories = @diaries.sum{ |diary| diary.calories }
    total_protein = @diaries.sum{ |diary| diary.protein }
    total_fats = @diaries.sum{ |diary| diary.fats }
    total_carbs = @diaries.sum{ |diary| diary.carbs }
    @piechart_macros = [[ 'protein', total_protein], [ 'fats', total_fats], [ 'carbs', total_carbs]]

  end

  def create
    diary = Diary.new(diary_params)
    diary.user_id = current_user.id
    diary.remove_nil
    diary.date ||= Date.today
    diary = multiply_by_servings(diary)
    if diary.save
      redirect_to root_path
    end
  end

  def destroy
    diary = Diary.find(params[:id])
    if diary.destroy
      redirect_to diaries_path
    end
  end

  private

  def diary_params
    params.require(:diary).permit(:calories, :protein, :fats, :carbs, :time_of_day, :meal_id, :food_id, :date, :servings)
  end

  def init_diary(date)
    diaries_by_date = current_user.diaries.where(date: Date.new(2023,1,1) + (date-1))
    if user_signed_in? && diaries_by_date.empty?
      ["Breakfast", "Lunch", "Dinner"].each do |time_of_day|
        Diary.create(
          user_id: current_user.id, 
          calories: 0, 
          protein: 0, 
          fats: 0, 
          carbs: 0, 
          time_of_day: time_of_day, 
          date: Date.new(2023,1,1) + (date-1),
          servings: 1
        )
      end
    end
  end

  def multiply_by_servings(diary)
    diary.calories *= diary.servings
    diary.protein *= diary.servings
    diary.fats *= diary.servings
    diary.carbs *= diary.servings
    diary
  end
  
end