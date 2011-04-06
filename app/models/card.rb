class Card < ActiveRecord::Base
  belongs_to :expansion
  belongs_to :artist
  belongs_to :rarity
  
  has_many :card_relations
  #has_many :related_cards, :through => :card_relations, :forign_key => 'card_a_id'
  has_many :restrictions
  
  has_many :deck_cards
  has_many :decks, :through => :deck_cards, :uniq => true
  
  # cards with same casting cost:
  has_many :cards_with_same_casting_cost, :foreign_key => :casting_cost, :primary_key => :casting_cost, :class_name => 'Card'
  has_many :cards_with_same_converted_casting_cost, :foreign_key => :converted_casting_cost, :primary_key => :converted_casting_cost, :class_name => 'Card'

  def to_json
    {
        :name => self.name, 
        :multiverse_id => self.multiverse_id,
        :casting_cost => self.casting_cost,
        :card_type => self.card_type,
        :power => self.power,
        :toughness => self.toughness
    }
  end
end
