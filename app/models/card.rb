class Card < ActiveRecord::Base
  belongs_to :expansion
  belongs_to :artist
  belongs_to :rarity
  
  has_many :card_relations
  #has_many :related_cards, :through => :card_relations, :forign_key => 'card_a_id'
  has_many :restrictions
  
  # cards with same casting cost:
  has_many :cards_with_same_casting_cost, :foreign_key => :casting_cost, :primary_key => :casting_cost, :class_name => 'Card'
  has_many :cards_with_same_converted_casting_cost, :foreign_key => :converted_casting_cost, :primary_key => :converted_casting_cost, :class_name => 'Card'
end
