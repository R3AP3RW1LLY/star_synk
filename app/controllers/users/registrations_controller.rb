# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :html, :turbo_stream

  before_action :configure_permitted_parameters, if: :devise_controller?

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
