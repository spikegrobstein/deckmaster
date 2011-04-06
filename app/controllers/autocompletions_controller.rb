class AutocompletionsController < ApplicationController
  
  def create
    cards = Card.find(:all, :limit => 10, :conditions => "name like '#{params[:cardname]}%'", :group => :name)
    
    respond_to do |format|
      format.json do
        render :json => cards.collect { |c| c.to_json }
      end
    end
  end
  
end
