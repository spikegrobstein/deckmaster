class AutocompletionsController < ApplicationController
  
  def create
    cards = Card.find(:all, :limit => 10, :conditions => "name like '#{params[:cardname]}%'")
    
    respond_to do |format|
      format.json { render :json => cards.collect { |c| c.name }.uniq }
    end
  end
  
end
