class FoodsController < ApplicationController
  before_action :authenticate_user!
  
  def create
    @food = Food.new(food_params)
    @food.user_id = current_user.id
    @food.remove_nil
    if @food.save
      render json: { status: 'success', food: @food }, status: :ok
    else
      render json: { status: 'error' }, status: :unprocessable_entity
    end
  end

  def destroy
    food = Food.find(params[:id])
    if food.destroy
      render json: {status: 'success'}, status: :ok
    else  
      render json: {status: 'error'}, status: :unprocessable_entity
    end
  end

  private

  def food_params
    params.require(:food).permit(:food_name, :calories, :protein, :fats, :carbs)
  end
end
