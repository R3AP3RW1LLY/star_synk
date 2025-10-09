# frozen_string_literal: true

require "sidekiq"
require "sidekiq-cron"
require "dotenv/load"

# Fetch Redis URL from environment
redis_url = ENV.fetch("REDIS_URL", "redis://127.0.0.1:6379/0")

Sidekiq.configure_server do |config|
  config.redis = { url: redis_url }

  # Load schedule file (if present)
  schedule_file = Rails.root.join("config", "sidekiq.yml")
  if File.exist?(schedule_file)
    schedule = YAML.load_file(schedule_file)
    if schedule["schedule"]
      Sidekiq::Cron::Job.load_from_hash(schedule["schedule"])
      Rails.logger.info("🕒 Sidekiq-Cron schedule loaded from config/sidekiq.yml")
    end
  end
end

Sidekiq.configure_client do |config|
  config.redis = { url: redis_url }
end
