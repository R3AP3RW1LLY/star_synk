require "sidekiq/web"
require "sidekiq/cron/web"

Rails.application.routes.draw do
  devise_for :users,
            controllers: {
              registrations: "users/registrations",
              sessions: "users/sessions",
              confirmations: "users/confirmations",
              passwords: "users/passwords"
            },
            path_names: {
              sign_in: "login",
              sign_out: "logout",
              sign_up: "register"
            },
            path: ""

  mount ActionCable.server => "/cable"
  mount Sidekiq::Web => "/sidekiq"
end
