class CreateDeckCards < ActiveRecord::Migration
  def self.up
    create_table :deck_cards do |t|
      t.integer :deck_id
      t.integer :card_id

      t.timestamps
    end
  end

  def self.down
    drop_table :deck_cards
  end
end
