class TimezonesController < ApplicationController
  def index
    country_code = params[:country].to_s.upcase.strip

    if country_code.present?
      begin
        country = TZInfo::Country.get(country_code)
        zones = country.zones.map do |zone|
          {
            id: zone.identifier,
            name: zone.identifier.split("/").last.tr("_", " ")
          }
        end
      rescue TZInfo::InvalidCountryCode
        zones = []
      end
    else
      zones = []
    end

    render json: zones
  end
end
