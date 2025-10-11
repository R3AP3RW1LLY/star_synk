# frozen_string_literal: true

class User < ApplicationRecord
  # ActiveStorage
  has_one_attached :avatar

  # Devise modules
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :trackable

  # Validations
  validates :confirmed_rsi_ownership, inclusion: { in: [ true, false ] }
  validates :star_citizen_handle, presence: true, uniqueness: true
  validates :country, presence: true
  validates :time_zone, presence: true
  validates :role, presence: true

  # Roles
  ROLES = %w[member app_owner developer support moderator].freeze

  def admin?
    %w[app_owner developer support moderator].include?(role)
  end

  def member?
    role == "member"
  end
end
