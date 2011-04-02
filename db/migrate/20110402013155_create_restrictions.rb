class CreateRestrictions < ActiveRecord::Migration
  def self.up
    create_table :restrictions do |t|
      t.string :legality
      t.string :deck_type
      t.integer :card_id

      t.timestamps
    end
  end

  def self.down
    drop_table :restrictions
  end
end
