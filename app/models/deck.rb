class Deck < ActiveRecord::Base
  has_many :deck_cards
  has_many :cards, :through => :deck_cards, :order => 'cards.name'
  
  def to_json
    card_list = self.cards.find(:all, :group => 'name', :select => "*, count(name) as quantity")
    
    {
      :name => self.name,
      :description => self.description,
      :cards => card_list.collect { |c| 
        card = c.to_json
        card[:quantity] = c.quantity
        card
      }
    }
  end
end
