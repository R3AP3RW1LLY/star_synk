# frozen_string_literal: true

if defined?(ActionMailer)
  ActionMailer::Base.delivery_method = :postmark
  ActionMailer::Base.postmark_settings = {
    api_token: ENV["POSTMARK_API_TOKEN"]
  }

  Rails.logger.info("📬 Postmark configured as default mailer")
end
