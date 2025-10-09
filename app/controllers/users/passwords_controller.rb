# frozen_string_literal: true

class Users::PasswordsController < Devise::PasswordsController
  respond_to :html, :turbo_stream
end
