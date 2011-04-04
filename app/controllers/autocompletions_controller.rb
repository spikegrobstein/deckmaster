class AutocompletionsController < ApplicationController
  
  def create
    cards = Card.find(:all, :limit => 10, :conditions => "name like '#{params[:cardname]}%'", :group => :name)
    
    respond_to do |format|
      format.json do
        card_info = cards.collect do |c| 
          { 
            :name => c.name, 
            :multiverse_id => c.multiverse_id,
            :casting_cost => c.casting_cost,
            :card_type => c.card_type,
            :power => c.power,
            :toughness => c.toughness
          }
        end
        
        render :json => card_info
      end
    end
  end
  
end
