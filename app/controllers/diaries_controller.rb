class DiariesController < ApplicationController
  before_action :init_diary, only: %i[ index ]
  before_action :authenticate_user!

  def index
    diaries = current_user.diaries
    @breakfast_diaries = diaries.select { |diary| diary.time_of_day == "Breakfast" }
    @lunch_diaries = diaries.select { |diary| diary.time_of_day == "Lunch" }
    @dinner_diaries = diaries.select { |diary| diary.time_of_day == "Dinner" }
    @diary = Diary.new

    @foods = current_user.foods
    @meals = current_user.meals
    @meal = Meal.new
    @foods_meal = FoodsMeal.new
    @food = Food.new
  end

  def create
    @diary = Diary.new(diary_params)
    @diary.user_id = current_user.id
    @diary.remove_nil
    if @diary.save
      redirect_to root_path
    else
      render :index
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
    params.require(:diary).permit(:calories, :protein, :fats, :carbs, :time_of_day, :meal_id, :food_id)
  end

  def init_diary
    if user_signed_in?
      ["Breakfast", "Lunch", "Dinner"].each do |time_of_day|
        if current_user.diaries.find_by(time_of_day: time_of_day) == nil
          Diary.create(user_id: current_user.id, calories:0, protein: 0, fats: 0, carbs: 0, time_of_day: time_of_day)
        end
      end
    end
  end
end