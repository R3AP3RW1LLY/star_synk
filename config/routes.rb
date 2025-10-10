require "sidekiq/web"
require "sidekiq/cron/web"

Rails.application.routes.draw do
  root "marketing#home"
  get "/about",    to: "marketing#about"
  get "/features", to: "marketing#features"
  get "/contact",  to: "marketing#contact"

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

  get "/timezones", to: "timezones#index"

  mount ActionCable.server => "/cable"
  mount Sidekiq::Web => "/sidekiq"
end
