class Deck < ActiveRecord::Base
  has_many :deck_cards
  has_many :cards, :through => :deck_cards, :order => 'cards.name'
  
  def duplicate
    d = self.clone
    d.name = "#{self.name} duplicate"
    
    d.save!
    
    self.cards.each do |c|
      d.cards << c
    end
    
    d.save!
    
    return d
  end
  
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
