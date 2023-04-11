class DiariesController < ApplicationController

  def new
    @diary = Diary.new
  end

  def index
    @diary = Diary.new
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