require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module StarSynk
  class Application < Rails::Application
    config.load_defaults 8.0
    config.active_job.queue_adapter = :sidekiq

    config.assets.paths << Rails.root.join("app/assets/builds")
    config.assets.precompile += %w[builds/*.js builds/*.css]
    config.autoload_lib(ignore: %w[assets tasks])
    config.generators.system_tests = nil
  end
end
