class FoodsController < ApplicationController
  def new
    @food = Food.new
  end

  def index
    @foods = Food.all
  end

  def show
    
  end
  
  def create
    @food = Food.new(food_params)
    @food.user_id = 1
    if @food.save
      redirect_to root_path
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

  def food_params
    params.require(:food).permit(:food_name, :calories, :protein, :fats, :carbs)
  end
end
