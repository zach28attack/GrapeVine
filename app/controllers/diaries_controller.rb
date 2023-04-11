class DiariesController < ApplicationController

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
  end

  def create
    @diary = Diary.new(diary_params)
    @diary.user_id = 1
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
    params.require(:diary).permit(:calories, :protein, :fats, :carbs, :time_of_day)
  end
end