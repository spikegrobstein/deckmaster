class CardRelation < ActiveRecord::Base
  has_one :card_a, :class_name => 'Card'
  has_one :card_b, :class_name => 'Card'
end
