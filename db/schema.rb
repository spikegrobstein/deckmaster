# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110402033221) do

  create_table "artists", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "card_relations", :force => true do |t|
    t.integer  "card_a_id"
    t.integer  "card_b_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "cards", :force => true do |t|
    t.string   "name"
    t.string   "casting_cost"
    t.integer  "converted_casting_cost"
    t.string   "card_type"
    t.integer  "power"
    t.integer  "toughness"
    t.string   "flavor_text"
    t.string   "text"
    t.integer  "expansion_id"
    t.integer  "rarity_id"
    t.integer  "artist_id"
    t.integer  "multiverse_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "deck_cards", :force => true do |t|
    t.integer  "deck_id"
    t.integer  "card_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "decks", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "expansions", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "rarities", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "restrictions", :force => true do |t|
    t.string   "legality"
    t.string   "deck_type"
    t.integer  "card_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
