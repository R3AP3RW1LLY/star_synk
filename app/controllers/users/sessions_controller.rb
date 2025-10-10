# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  layout "marketing"
  respond_to :html, :turbo_stream
end
