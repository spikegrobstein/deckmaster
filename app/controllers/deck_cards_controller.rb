class DeckCardsController < ApplicationController
  
  def create
    logger.debug params
    
    @deck_card = DeckCard.create!(params[:deck_card])
    
    respond_to do |format|
      format.json do
        render :json => @deck_card.deck
      end
    end
  end
  
  def destroy
    d = DeckCard.find(:first, :conditions => [ "deck_id = :deck_id and card_id = :card_id", params ])
    unless d.nil?
      d.destroy
    end
  end
  
end
