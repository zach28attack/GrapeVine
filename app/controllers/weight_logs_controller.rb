class WeightLogsController < ApplicationController
  before_action :authenticate_user!
  
  def index
    @weight_log = WeightLog.new
    @logs = current_user.weight_logs
    get_chart_data(@logs)
  end

  def create
    weight_log = WeightLog.new(weight_log_params)
    weight_log.user_id = current_user.id
    if weight_log.save
      redirect_to weight_logs_path
    else
      render :index, status: :unprocessable_entity
    end
  end

  def destroy
    
  end

  private

  def weight_log_params
    params.require(:weight_log).permit(:log)
  end

  def get_chart_data(logs)
    if logs.count > 0
      # chart-kick requires data be in [data, data] format 
      @chart_data = logs.map {|log| [ log.created_at, log.log ]}
      # set the range of the charts y-axis scale
      @min_log = logs.min_by {|log| log.log }
      @min_chart_data = @min_log.log - 20
      max_log = logs.max_by {|log| log.log}
      @max_chart_data = max_log.log + 20
    end
  end
end
