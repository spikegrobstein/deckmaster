class DrawsController < ApplicationController
  
  def show
    @deck = Deck.find(params[:deck_id])
    @cards = @deck.cards.shuffle
    @hand = @cards[0,7]
  end
  
end
