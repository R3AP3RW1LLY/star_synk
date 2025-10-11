class AddConfirmedRsiOwnershipToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :confirmed_rsi_ownership, :boolean, default: false, null: false
  end
end
