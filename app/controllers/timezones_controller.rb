class TimezonesController < ApplicationController
  def index
    country_code = params[:country]
    zones = ActiveSupport::TimeZone.all
               .select { |tz| tz.tzinfo&.country&.code == country_code }
               .map(&:name)

    render json: zones.uniq.sort
  end
end
