class CreateCardRelations < ActiveRecord::Migration
  def self.up
    create_table :card_relations do |t|
      t.integer :card_a_id
      t.integer :card_b_id

      t.timestamps
    end
  end

  def self.down
    drop_table :card_relations
  end
end
