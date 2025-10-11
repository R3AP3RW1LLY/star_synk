# app/controllers/timezones_controller.rb
class TimezonesController < ApplicationController
  # Public endpoint for the registration form
  skip_before_action :verify_authenticity_token
  skip_before_action :authenticate_user!, raise: false if respond_to?(:authenticate_user!)

  def index
    country_name = params[:country].to_s.strip
    return render json: [] if country_name.blank?

    country = ISO3166::Country.find_country_by_name(country_name) ||
              ISO3166::Country[country_name]
    return render json: [] unless country

    begin
      require "tzinfo"
      zones = TZInfo::Country.get(country.alpha2).zones.map(&:identifier)
      render json: zones.uniq.sort
    rescue TZInfo::InvalidCountryCode
      render json: []
    rescue => e
      Rails.logger.error("TimezonesController#index error: #{e.message}")
      render json: []
    end
  end
end
