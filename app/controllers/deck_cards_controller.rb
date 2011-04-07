class DeckCardsController < ApplicationController
  
  def create
    logger.debug params
    
    @deck_card = DeckCard.create!(params[:deck_card])
    
    respond_to do |format|
      format.json do
        render :json => @deck_card.deck.to_json
      end
    end
  end
  
  def destroy
    d = DeckCard.find(:first, :conditions => [ "deck_id = :deck_id and card_id = :card_id", params[:deck_card] ])
    
    unless d.nil?
      deck = d.deck
      d.destroy
      redirect_to deck_path(deck, :format => :json)
    else
      raise ActiveRecord::RecordNotFound
    end
    
  end
  
end
