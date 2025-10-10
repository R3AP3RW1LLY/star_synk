class TimezonesController < ApplicationController
  def index
    country_code = params[:country]

    if country_code.present?
      begin
        # Use Rails’ built-in mapping of time zones per country
        zones = ActiveSupport::TimeZone.country_zones(country_code.upcase).map(&:name)
      rescue StandardError
        zones = []
      end
    else
      zones = []
    end

    render json: zones
  end
end
