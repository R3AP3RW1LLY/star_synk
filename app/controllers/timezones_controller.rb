class TimezonesController < ApplicationController
  # Public JSON endpoint for registration form (no auth, no CSRF)
  protect_from_forgery with: :null_session

  def index
    country_name = params[:country].to_s.strip
    return render json: [] if country_name.blank?

    # Try to resolve country by name or code
    country =
      ISO3166::Country.find_country_by_alpha2(country_name.upcase) ||
      ISO3166::Country.find_country_by_alpha3(country_name.upcase) ||
      ISO3166::Country.find_country_by_name(country_name)

    # If not found, return empty array
    return render json: [] unless country

    # Always produce simple array of timezone strings
    zones = Array(country.timezones).map(&:to_s).uniq.compact

    render json: zones
  rescue StandardError => e
    Rails.logger.error("TimezonesController#index failed: #{e.message}")
    render json: []
  end
end
