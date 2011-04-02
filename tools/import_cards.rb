require 'nokogiri'
require 'pp'
require 'parallel'

class CardLoader
  @pages = %w( Details Languages Printings Discussion)

  @cards_basepath = '/Users/spike/cards'
  #@cards_basepath = '/home/spike/tests/gatherer/cards'
  
  attr_accessor :multiverse_id
  attr_accessor :data # hash of strings of data from pages
  attr_accessor :xml # hash of nokogiri objects of data from pages
  
  attr_accessor :name, :casting_cost, :converted_casting_cost, :type, :text, :power, :toughness, :expansion, :rarity, :artist, :other_sets, :restrictions, :flavor_text
  
  def initialize(multiverse_id)
    self.multiverse_id = multiverse_id.to_i
    self.data = CardLoader::get_card_data(self.multiverse_id)
    
    # convert that shit into nokogiri objects
    self.xml = {}
    self.data.each do |key, data|
      self.xml[key] = Nokogiri::XML(data)
    end
    
    # initialize all of the fields
    self.get_name
    self.get_casting_cost
    self.get_converted_casting_cost
    self.get_type
    self.get_text
    self.get_power_toughness
    self.get_expansion
    self.get_rarity
    self.get_artist
    self.get_other_sets
    self.get_restrictions
    self.get_flavor_text
  end
  
  # readers for the fields:
  
  protected
  
  def get_name
    self.name = self.xml['Details'].xpath('//x:div[@id = "ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_nameRow"]/x:div[@class = "value"]', 'x' => 'http://www.w3.org/1999/xhtml').text.strip
  end
  
  def get_casting_cost
    self.casting_cost = self.fix_casting_cost(self.xml['Details'].xpath('//x:div[@id = "ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_manaRow"]/x:div[@class = "value"]', 'x' => 'http://www.w3.org/1999/xhtml')).text.strip
  end
  
  def get_converted_casting_cost
    self.converted_casting_cost = self.xml['Details'].xpath('//x:div[@id = "ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_cmcRow"]/x:div[@class = "value"]', 'x' => 'http://www.w3.org/1999/xhtml').text.strip
  end
  
  def get_type
    self.type = self.xml['Details'].xpath('//x:div[@id = "ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_typeRow"]/x:div[@class = "value"]', 'x' => 'http://www.w3.org/1999/xhtml').text.strip.gsub(/\s+/, ' ')
  end
  
  def get_text
    text = self.xml['Details'].xpath('//x:div[@id = "ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_textRow"]/x:div[@class = "value"]', 'x' => 'http://www.w3.org/1999/xhtml')
    
    text = self.fix_casting_cost(text)
    
    text.search('//x:div[@class = "cardtextbox"]', 'x' => 'http://www.w3.org/1999/xhtml').each do |box|
      box.replace "#{box.text}\n"
    end
    
    self.text = text.text.strip
  end
  
  def get_power_toughness
    power_toughness = self.xml['Details'].xpath('//x:div[@id = "ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_ptRow"]/x:div[@class = "value"]', 'x' => 'http://www.w3.org/1999/xhtml').text.strip
    
    (self.power, self.toughness) = power_toughness.split(/\s*\/\s*/)
  end
  
  def get_expansion
    self.expansion = self.xml['Details'].xpath('//x:div[@id = "ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_setRow"]/x:div[@class = "value"]//x:a', 'x' => 'http://www.w3.org/1999/xhtml')[-1].text
  end
  
  def get_rarity
    self.rarity = self.xml['Details'].xpath('//x:div[@id = "ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_rarityRow"]/x:div[@class = "value"]', 'x' => 'http://www.w3.org/1999/xhtml').text.strip
  end
  
  def get_artist
    self.artist = self.xml['Details'].xpath('//x:div[@id = "ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_artistRow"]/x:div[@class = "value"]', 'x' => 'http://www.w3.org/1999/xhtml').text.strip
  end
  
  # just an array of multiverse_ids of the other sets
  def get_other_sets
    other_sets = self.xml['Details'].xpath('//x:div[@id = "ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_otherSetsRow"]/x:div[@class = "value"]', 'x' => 'http://www.w3.org/1999/xhtml')
    
    self.other_sets = []
    other_sets.search('//x:a/@href', 'x' => 'http://www.w3.org/1999/xhtml').each do |href|
      if href.to_s.match /multiverseid=(\d+)/
        self.other_sets << $1
      end
    end
  end
  
  def get_restrictions
    self.restrictions = {}
    table = self.xml['Printings'].xpath('//x:table[@class="cardList"][2]', 'x' => 'http://www.w3.org/1999/xhtml')
    
    table.xpath('x:tr[contains(@class, "cardItem")]', 'x' => 'http://www.w3.org/1999/xhtml').each do |tr|
      set = tr.xpath('x:td[1]', 'x' => 'http://www.w3.org/1999/xhtml').text.strip
      legality = tr.xpath('x:td[2]', 'x' => 'http://www.w3.org/1999/xhtml').text.strip
      
      self.restrictions[set] = legality
    end
    
  end
  
  def get_flavor_text
    self.flavor_text = self.xml['Details'].xpath('//x:div[@id = "ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_flavorRow"]/x:div[@class = "value"]', 'x' => 'http://www.w3.org/1999/xhtml').text.strip
  end
  
  # utility
  
  # removes all casting cost shit and replaces with text that can be easily parsed
  def fix_casting_cost(node)
    node.search('//x:img', 'x' => 'http://www.w3.org/1999/xhtml').each do |img|
      symbol = case img['alt']
      when 'Red' then "R"
      when 'Green' then 'G'
      when 'White' then 'W'
      when 'Black' then 'B'
      when 'Blue' then 'U'
      else
        img['alt']
      end
      
      #puts self.multiverse_id
      #pp img
      
      img.replace "[#{symbol}]"
    end
    
    return node
  end
  
  public
  class << self
    def path_to(multiverse_id, page)
      card_path = File.join("%08d" % multiverse_id.to_i).scan(/../)
      card_path.pop # we only want the first 3 elements, really.
  
      File.join(@cards_basepath, card_path, filename_for(multiverse_id, page))
    end

    def filename_for(multiverse_id, page)
      "#{ "%08d" % multiverse_id.to_i }_#{ page }.html"
    end

    # finds a card and returns a hash with elements for each page
    def get_card_data(multiverse_id)
      card = {}
  
      @pages.each do |page|
        #puts "Opening: #{path_to(multiverse_id, page)}"
        card[page] = File.open(path_to(multiverse_id, page)).read
      end
  
      return card
    end
  end
end

#################################################
#################################################
#################################################
#################################################

Parallel.map((1..270000).to_a, :in_processes => 20) do |multiverse_id|
  begin
    c = CardLoader.new(multiverse_id)
  rescue
    next
  end
  
  card = Card.new(
    :name => c.name,
    :casting_cost => c.casting_cost,
    :converted_casting_cost => c.converted_casting_cost,
    :card_type => c.type,
    :power => c.power,
    :toughness => c.toughness,
    :flavor_text => c.flavor_text,
    :multiverse_id => c.multiverse_id
  )
  
  rarity = Rarity.find_by_name(c.rarity)
  if rarity.nil?
    rarity = Rarity.create!(:name => c.rarity)
  end
  card.rarity = rarity
  
  expansion = Expansion.find_by_name(c.expansion)
  if expansion.nil?
    expansion = Expansion.create!(:name => c.expansion)
  end
  card.expansion = expansion
  
  artist = Artist.find_by_name(c.artist)
  if artist.nil?
    artist = Artist.create!(:name => c.artist)
  end
  card.artist = artist
  
  card.save!
  
  c.restrictions.each do |deck_type, restriction|
    Restriction.create!(
      :card => card,
      :deck_type => deck_type,
      :legality => restriction
    )
  end
    
  puts "Loaded: #{card.name}"
end