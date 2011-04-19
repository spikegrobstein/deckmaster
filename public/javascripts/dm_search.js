// first, let's load some templates.
$.get('/javascripts/templates/deck_list_card.tmpl.html', function(d) { $.template('deck_list_card', d); });
$.get('/javascripts/templates/search_result.tmpl.html', function(d) { $.template('search_result', d); });

// Main plugin: 
////////////////////////////////////////////////////////////////////////////////////////

$.fn.extend({ dm_search: function(results_element, click_callback) {
	var results_element = $(results_element);
	var self = $(this);
	
	var last_search = '';
	var search_in_progress = null;
	var queued_search = null;
	
	var search_timeout = null;
	
	// functions for working with the selection
	var result_selection = {
		
		// clears the selection
		clear: function() {
			$('li', results_element).removeClass('selected');
		},
		
		// sets the selection to the desired offset
		set: function(offset) {
			result_selection.clear();
			
			//console.log($('li', results_element));
			
			$('li', results_element)
				.eq(offset)
				.addClass('selected');
		},
		
		// finds the selection in the results and returns the element
		find: function() {
			return $('li.selected', results_element);
		},
		
		// returns which element in the results is selected and returns its 0-based index
		find_offset: function() {
			var index = -1;	
			$('li', results_element).each(function(i, r) {				
				if ($(r).hasClass('selected')) {
					index = i;
					return;
				}
			});
			
			if (index >= 0) {
				return index;
			}
			
			$.error("Oh no! Selection not found??");
		},
		
		move: function(direction) {
			var selection = result_selection.find();
			
			if (selection.length) {
				// if there's a selection... then let's move it up one... if it can go
				if (direction == "up") {
					if (selection.prev().length) {
						selection.removeClass('selected');
						selection.prev().addClass('selected');
					}
				} else if (direction == "down") {
					if (selection.next().length) {
						selection.removeClass('selected');
						selection.next().addClass('selected');
					}
				} else {
					$.error('Unknown direction: ' + direction);
				}
			} else {
				// there's no selection, let's select the first element.
				$('li', results_element).first().addClass('selected');
			}
			
		},
		
		// move the selection up one
		move_up: function() {
			result_selection.move('up');
		},
		
		// move the selection down one
		move_down: function() {
			result_selection.move('down');
		},
		
	}
	
	function handle_click(card, event) {
		click_callback($(card), event);
		
		self.select();
	}
	
	// wire up the live click event on all the cards
	$('.card', results_element).live('click', function(event) { handle_click(this, event); });
	
	// wire up the mouse-enter event so the thing gets highlighted when the user mouse-overs
	$('.card', results_element).live('mouseenter', function(event) {		
		result_selection.set( $(".card", results_element).index(this) );
		
		// after highlighting, make sure search field has focus
		self.focus();
	});
	
	$('#deck').css({
		"margin-top": $('#deck_header').innerHeight()
	});
	offset = $('#deck_header').offset()
	$('#deck_header').css({
		width: $(this).innerWidth(),
		position: "fixed",
	});
	
	self.keydown(function(event) {
		// real-time searching of cards
		
		//console.log(event.keyCode);
		
		key_handlers = { 
			40: "down",
			38: "up",
			13: "enter",
			27: "esc"
		};
		
		if (event.keyCode in key_handlers) {
			switch (key_handlers[event.keyCode]) {
				case 'up':
					result_selection.move_up();
					
					break;
				case 'down':
					result_selection.move_down();
					
					break;
				case 'enter':
					handle_click(result_selection.find(), null);
					
					break;
				case 'esc':
					self.val('');
					results_element.html(''); // clear that shit
					
					break;
			}
			
			return false;
		}
		
		if(search_timeout) { clearTimeout(search_timeout); }
		
		search_timeout = setTimeout(function() {
			// if the field hasn't changed yet or the field is empty, return
			if (self.val() == last_search) { return; }
			if (self.val() == '') { 
				results_element.html('');
				return;
			}

			// if a search is in progress, queue the new search up and return
			if (search_in_progress) {
				queued_search = self.val();
				return;
			}
			
			last_search = self.val();
			search_in_progress = true;

			$.ajax({
			    url: '/autocompletions',
			    type: 'POST',
					dataType: 'json',
			    data: { 'cardname': self.val() },
			    success: function(data) {

							//if (data.length <= 0) { return; }

							results_element.html(''); // clear that shit

							$.tmpl('search_result', data).appendTo(results_element);
							
							if (data.length > 0) {
								result_selection.set(0);
							}
			    },
					complete: function() {
						search_in_progress = false;
						if (queued_search) {
							self.keydown();
							queued_search = null;
						}
					}
			});
		}, 200);
	});
	
	// at end of initialization, fire off keydown() event.
	self.keydown();

}});