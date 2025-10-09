# frozen_string_literal: true

module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :session_id

    def connect
      self.session_id = SecureRandom.uuid
      Rails.logger.info("🧩 ActionCable connected: #{session_id}")
    end
  end
end
