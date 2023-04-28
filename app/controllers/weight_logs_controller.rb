class WeightLogsController < ApplicationController

  def new
    
  end

  def index
    @entries = WeightLog.all
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
