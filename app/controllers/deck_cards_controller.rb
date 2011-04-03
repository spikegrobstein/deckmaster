class DeckCardsController < ApplicationController
  
  def create
    DeckCard.create!(params)
  end
  
  def destroy
    d = DeckCard.find(:first, :conditions => [ "deck_id = :deck_id and card_id = :card_id", params ])
    unless d.nil?
      d.destroy
    end
  end
  
end
