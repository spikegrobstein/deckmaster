class CreateCards < ActiveRecord::Migration
  def self.up
    create_table :cards do |t|
      t.string :name
      t.string :casting_cost
      t.integer :converted_casting_cost
      t.string :card_type
      
      # the power/toughness as displayed on the card
      # variable p/t would be "*" where sometihng like assquach is "1{1/2}"
      t.string :power
      t.string :toughness
      
      # for querying power/toughness ranges:
      t.integer :power_int
      t.integer :toughness_int
      
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
