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
      render json: { status: 'success', food: @food }, status: :ok
    else
      render json: { status: 'error' }, status: :unprocessable_entity
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
