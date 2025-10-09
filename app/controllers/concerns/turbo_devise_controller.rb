# frozen_string_literal: true

# This concern ensures Devise plays nicely with Turbo Streams
module TurboDeviseController
  extend ActiveSupport::Concern

  included do
    # Responds correctly to turbo_stream or HTML
    respond_to :html, :turbo_stream
  end

  private

  # Redirect properly on sign in / out when using Turbo
  def respond_with(resource, _opts = {})
    if request.format.turbo_stream?
      render turbo_stream: turbo_stream.replace("flash", partial: "shared/flash")
    else
      super
    end
  end

  def respond_to_on_destroy
    if request.format.turbo_stream?
      render turbo_stream: turbo_stream.replace("flash", partial: "shared/flash")
    else
      super
    end
  end
end
