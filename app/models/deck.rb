class Deck < ActiveRecord::Base
  has_many :deck_cards
  has_many :cards, :through => :deck_cards, :order => 'cards.name'
  
  def as_json(options={})
    card_list = self.cards.find(:all, :group => 'name', :select => "cards.*, count(name) as quantity")
    
    {
      :name => self.name,
      :description => self.description,
      :cards => card_list.collect { |c| 
        card = c.as_json()
        card[:quantity] = c.quantity
        card
      }
    }
  end
end
