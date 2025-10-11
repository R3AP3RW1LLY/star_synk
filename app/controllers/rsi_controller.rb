# app/controllers/rsi_controller.rb
class RsiController < ApplicationController
  # GET /rsi_check?handle=USERNAME
  def check
    handle = params[:handle].to_s.strip
    if handle.blank?
      render json: { valid: false, message: "Handle missing" }, status: :bad_request
      return
    end

    begin
      result = RsiCitizenChecker.verify(handle)
      render json: result, status: :ok
    rescue => e
      Rails.logger.error("[RSI CHECK ERROR] #{e.class}: #{e.message}")
      render json: { valid: false, message: "Internal error verifying handle" },
             status: :internal_server_error
    end
  end
end
