# frozen_string_literal: true

Rails.application.config.session_store(
  store: :redis_store,
  servers: [
    {
      url: ENV.fetch("REDIS_URL", "redis://127.0.0.1:6379/0"),
      name: "_star_synk_session",
      expires_in: 90.minutes
    }
  ],
  key: "_star_synk_session",
  threadsafe: true,
  secure: Rails.env.production?
)
