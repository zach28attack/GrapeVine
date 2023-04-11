class DiariesController < ApplicationController
  def new
    @diary = Diary.new
  end
  def index
  end
end