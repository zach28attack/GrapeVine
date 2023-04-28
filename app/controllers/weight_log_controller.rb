class WeightLogController < ApplicationController
  
  def new
    
  end

  def index
    
  end

  def create
    
  end

  def edit
    
  end

  def update
    
  end

  def destroy
    
  end

  private

  def weight_params
    params.require(:WeightLog).permit(:log)
  end
end
