# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  layout "marketing"
  respond_to :html, :turbo_stream

  before_action :configure_permitted_parameters, if: :devise_controller?

  def new
    # Build a list of all countries using the 'countries' gem
    @countries = ISO3166::Country.all.map do |country|
      {
        name: country.common_name || country.name,
        code: country.alpha2
      }
    end

    # Convert to JSON once (safe for embedding into HTML)
    @countries_json = @countries.to_json

    super
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [
      :star_citizen_handle, :country, :time_zone, :avatar
    ])
    devise_parameter_sanitizer.permit(:account_update, keys: [
      :star_citizen_handle, :country, :time_zone, :avatar
    ])
  end
end
