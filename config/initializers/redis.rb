# frozen_string_literal: true

require "redis"

# Simple global Redis client for app-wide use
REDIS = Redis.new(
  url: ENV["REDIS_URL"],
  timeout: 5
)

# Log Redis connection during boot (useful in dev)
Rails.logger.info("✅ Connected to Redis at #{REDIS.connection[:host]}:#{REDIS.connection[:port]}") if defined?(Rails)
