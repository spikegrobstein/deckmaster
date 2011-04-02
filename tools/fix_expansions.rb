expansions = Expansion.all

expansions.each do |expansion|
    like_expansions = Expansion.find_all_by_name(expansion.name)
  
  # skip that shit if there's no dupes
  next if like_expansions.length == 1
  
  like_expansions.delete(expansion) # remove this one from the iterator
  
  like_expansions.each do |e|
    e.cards.each do |c|
      puts "Updating: #{expansion.name} / #{c.name}"
      c.expansion = expansion
      c.save!
    end
    
    e.delete
  end
  
  
end