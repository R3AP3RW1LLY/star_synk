# frozen_string_literal: true

# ─────────────────────────────────────────────────────────────────────────────
# Source
# ─────────────────────────────────────────────────────────────────────────────
source "https://rubygems.org"

# ─────────────────────────────────────────────────────────────────────────────
# Core framework
# ─────────────────────────────────────────────────────────────────────────────
ruby "3.4.6"
gem "rails", "~> 8.0.3"

# ─────────────────────────────────────────────────────────────────────────────
# Assets & Frontend
# ─────────────────────────────────────────────────────────────────────────────
gem "cssbundling-rails"         # CSS bundling (Tailwind/Sass/PostCSS)
gem "jsbundling-rails"          # JS bundling (esbuild/rollup/webpack)
gem "propshaft"                 # Modern asset pipeline
gem "stimulus-rails"            # Hotwire: Stimulus
gem "turbo-rails"               # Hotwire: Turbo

# ─────────────────────────────────────────────────────────────────────────────
# Database & JSON
# ─────────────────────────────────────────────────────────────────────────────
gem "jbuilder"                  # JSON responses
gem "pg", "~> 1.6.2"            # PostgreSQL adapter

# ─────────────────────────────────────────────────────────────────────────────
# Caching, Jobs, WebSockets (Rails 8 Solid* stack)
# ─────────────────────────────────────────────────────────────────────────────
gem "solid_cache"
gem "solid_cable"
gem "solid_queue"

# ─────────────────────────────────────────────────────────────────────────────
# Background processing
# ─────────────────────────────────────────────────────────────────────────────
gem "redis", "~> 5.4", ">= 5.4.1"
gem "sidekiq", "~> 8.0", ">= 8.0.8"
gem "sidekiq-cron", "~> 2.3", ">= 2.3.1"

# ─────────────────────────────────────────────────────────────────────────────
# Authentication & Security
# ─────────────────────────────────────────────────────────────────────────────
gem "devise", "~> 4.9", ">= 4.9.4"

# ─────────────────────────────────────────────────────────────────────────────
# Email & Notifications
# ─────────────────────────────────────────────────────────────────────────────
gem "postmark-rails", "~> 0.22.1"

# ─────────────────────────────────────────────────────────────────────────────
# Active Storage & File Processing
# ─────────────────────────────────────────────────────────────────────────────
gem "image_processing", "~> 1.14"

# ─────────────────────────────────────────────────────────────────────────────
# Web server & performance
# ─────────────────────────────────────────────────────────────────────────────
gem "bootsnap", require: false       # Faster boot via caching
gem "puma", ">= 7.0.4"               # HTTP server
gem "thruster", require: false       # HTTP asset caching/compression, X-Sendfile

# ─────────────────────────────────────────────────────────────────────────────
# Deployment
# ─────────────────────────────────────────────────────────────────────────────
gem "kamal", require: false          # Container-based deploys

# ─────────────────────────────────────────────────────────────────────────────
# Platform specifics
# ─────────────────────────────────────────────────────────────────────────────
gem "tzinfo-data", platforms: %i[windows jruby]

# ─────────────────────────────────────────────────────────────────────────────
# Optional features (uncomment as needed)
# ─────────────────────────────────────────────────────────────────────────────
# gem "bcrypt", "~> 3.1.7"           # has_secure_password

# ─────────────────────────────────────────────────────────────────────────────
# Development & Test
# ─────────────────────────────────────────────────────────────────────────────
group :development, :test do
  gem "brakeman", require: false                       # Security static analysis
  gem "debug", platforms: %i[mri windows], require: "debug/prelude"
  gem "dotenv-rails", "~> 3.1", ">= 3.1.8"             # Env vars for dev/test
  gem "rubocop-rails-omakase", require: false          # Ruby style (Rails Omakase)
end

group :development do
  gem "web-console"                                    # Console on error pages
end

gem "countries", "~> 8.0", ">= 8.0.4"
gem "ferrum", "~> 0.17.1"
gem "httparty", "~> 0.23.2"
