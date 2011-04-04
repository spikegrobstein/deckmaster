class CreateCards < ActiveRecord::Migration
  def self.up
    create_table :cards do |t|
      t.string :name
      t.string :casting_cost
      t.integer :converted_casting_cost
      t.string :card_type
      t.integer :power
      t.integer :toughness
      t.string :flavor_text
      t.string :text
      
      t.integer :expansion_id
      t.integer :rarity_id
      t.integer :artist_id
      
      t.integer :multiverse_id
      
      t.timestamps
    end
  end

  def self.down
    drop_table :cards
  end
end
