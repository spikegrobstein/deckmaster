class DecksController < ApplicationController
  
  def index
    @decks = Deck.all
  end
  
  def show
    @deck = Deck.find(params[:id])
  end
  
  def new
    @deck = Deck.new
  end
  
  def create
    @deck = Deck.new(params)
    
    begin
      @deck.save!
      flash[:notice] = "Deck created!"
      
      redirect_to deck_path(@deck)
    rescue ActiveRecord::RecordInvalid
      render new_deck_path
    end
  end
  
end