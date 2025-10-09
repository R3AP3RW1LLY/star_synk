# frozen_string_literal: true

Rails.application.config.action_cable.tap do |config|
  config.url = ENV["ACTION_CABLE_URL"]
  config.allowed_request_origins = [
    ENV["ORIGIN_1"],
    ENV["ORIGIN_2"]
  ]
end

Rails.logger.info("✅ Action Cable configured at #{Rails.application.config.action_cable.url}") if defined?(Rails)
