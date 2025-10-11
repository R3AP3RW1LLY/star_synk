class RsiCitizensController < ApplicationController
  def show
    handle = params[:handle].to_s.strip
    result = RsiCitizenChecker.verify(handle)
    render json: result, status: result[:status]
  end
end
