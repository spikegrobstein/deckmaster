class DeckCard < ActiveRecord::Base
  belongs_to :deck
  belongs_to :card
  
  default_scope :select => 'card_id, deck_id'
  
  def multiverse_id=(mid)
    self.card = Card.find_by_multiverse_id(mid)
  end
end
