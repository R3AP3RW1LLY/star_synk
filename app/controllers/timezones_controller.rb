class TimezonesController < ApplicationController
  def index
    code = params[:country_code].to_s.upcase
    return render json: { timezones: [], debug: "No country code provided" } if code.blank?

    zones = []
    debug_message = nil

    begin
      country = TZInfo::Country.get(code)
      zones = country.zones.map(&:identifier).sort
      debug_message = "Loaded #{zones.count} timezones for #{code}"
    rescue TZInfo::InvalidCountryCode
      debug_message = "Invalid country code: #{code}"
    rescue => e
      debug_message = "Error loading timezones: #{e.class} - #{e.message}"
    end

    render json: {
      timezones: zones,
      debug: debug_message
    }
  end
end
