class DiariesController < ApplicationController
before_action :init_diary
  def new
    @diary = Diary.new
  end

  def index
    diaries = Diary.all
    @breakfast_diaries = diaries.select { |diary| diary.time_of_day == "Breakfast" }
    @lunch_diaries = diaries.select { |diary| diary.time_of_day == "Lunch" }
    @dinner_diaries = diaries.select { |diary| diary.time_of_day == "Dinner" }
    @diary = Diary.new

    @foods = Food.all
    @meals = Meal.all
    @meal = Meal.new
    @foods_meal = FoodsMeal.new
  end

  def show
    
  end

  def create
    @diary = Diary.new(diary_params)
    @diary.user_id = 1
    @diary.remove_nil
    if @diary.save
      redirect_to root_path
    else
      render :index
    end
  end

  def edit
    
  end

  def update
    
  end

  def destroy
    
  end

  private

  def diary_params
    params.require(:diary).permit(:calories, :protein, :fats, :carbs, :time_of_day, :meal_id, :food_id)
  end

  def init_diary
    ["Breakfast", "Lunch", "Dinner"].each do |time_of_day|
    if Diary.find_by(time_of_day: time_of_day) == nil
      Diary.create(user_id: 1, calories:0, protein: 0, fats: 0, carbs: 0, time_of_day: time_of_day)
    end
    end
  end
end