// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

// cards in search results
$.template(
	'search_result', 
	'<li class="card" data-multiverse_id="${multiverse_id}">\
		<div>\
			<a class="card_name" href="#" rel="/cards/${multiverse_id}">${name}</a>\
			<span class="casting_cost">${casting_cost}</span>\
		</div>\
		<div>\
			<span class="type">${card_type}</span>\
			<span class="power_toughness">${power}/${toughness}\
		</div>\
	</li>'
);

// cards in a deck list
$.template(
	'deck_list_card',
	'<li class="card" data-card_id="${card_id}" data-multiverse_id="${multiverse_id}">\
    <h3 class="quantity">${quantity}</h3>\
    <div class="quantity_adjust">\
      <a class="increase" href="#">&uarr;</a>\
      <a class="decrease" href="#">&darr;</a>\
    </div>\
    <div>\
      <div class="first_row">\
        <span class="card_name">${name}</span>\
        <span class="casting_cost">${casting_cost}</span>\
      </div>\
      <div class="second_row">\
        <span class="card_type">${card_type}</span>\
        <span class="power_toughness">\
          <span class="power">${power}</span>\
          /\
          <span class="toughness">${toughness}</span>\
        </span>\
      </div>\
    </div>\
    <div style="float: none; clear: both"><!-- --></div>\
  </li>'
)

$.fn.extend({ dm_search: function(results_element, click_callback) {
	var results_element = $(results_element);
	var self = $(this);
	
	var last_search = '';
	var search_in_progress = null;
	var queued_search = null;
	
	// functions for working with the selection
	var result_selection = {
		
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
			
			console.log(result_selection.find_offset());
		},
		
		// move the selection up one
		move_up: function() {
			result_selection.move('up');
		},
		
		// move the selection down one
		move_down: function() {
			result_selection.move('down');
		},
		
		// the click callback
		click: function() {
			click_callback();
		},
	}
		
	
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
					result_selection.click(event.shiftKey);
					
					break;
				case 'esc':
					console.log(self.val(''));
					results_element.html(''); // clear that shit
					
					break;
			}
			
			return false;
		}
		
		setTimeout(function() {
			// if the field hasn't changed yet or the field is empty, return
			if (self.val() == this.last_search) { return; }
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
			    },
					complete: function() {
						search_in_progress = false;
						if (queued_search) {
							self.keydown();
							queued_search = null;
						}
					}
			});
		}, 250);
	});

}});

$(function() {
	$('#cardname').dm_search($('#autocomplete_results', function() { console.log('blah'); }));
});

/*
function move_selection_up() {
	var selection = $('#autocomplete_results li.selected');
	
	if (selection.length) {
		// if there's a selection... then let's move it up one... if it can go
		selection.removeClass('selected');
		selection.prev().addClass('selected');
	} else {
		// there's no selection, let's select the first element.
		$('#autocomplete_results li').first().addClass('selected');
	}
}

function move_selection_down() {
	var selection = $('#autocomplete_results li.selected');
	
	if (selection.length) {
		// if there's a selection... then let's move it up one... if it can go
		selection.removeClass('selected');
		selection.next().addClass('selected');
	} else {
		// there's no selection, let's select the first element.
		$('#autocomplete_results li').first().addClass('selected');
	}
}

function make_selection() {
	var selection = $('#autocomplete_results li.selected');
	
	selection.click();
}
*/
/*
$(function() {
	// build some templates
	
	// cards in search results
	$.template(
		'search_result', 
		'<li class="card" data-multiverse_id="${multiverse_id}">\
			<div>\
				<a class="card_name" href="#" rel="/cards/${multiverse_id}">${name}</a>\
				<span class="casting_cost">${casting_cost}</span>\
			</div>\
			<div>\
				<span class="type">${card_type}</span>\
				<span class="power_toughness">${power}/${toughness}\
			</div>\
		</li>'
	);
	
	// cards in a deck list (usually inside a li#deck element)
	$.template(
		'deck_list_card',
		'<li class="card" data-card_id="${card_id}" data-multiverse_id="${multiverse_id}">\
      <h3 class="quantity">${quantity}</h3>\
      <div class="quantity_adjust">\
        <a class="increase" href="#">&uarr;</a>\
        <a class="decrease" href="#">&darr;</a>\
      </div>\
      <div>\
        <div class="first_row">\
          <span class="card_name">${name}</span>\
          <span class="casting_cost">${casting_cost}</span>\
        </div>\
        <div class="second_row">\
          <span class="card_type">${card_type}</span>\
          <span class="power_toughness">\
            <span class="power">${power}</span>\
            /\
            <span class="toughness">${toughness}</span>\
          </span>\
        </div>\
      </div>\
      <div style="float: none; clear: both"><!-- --></div>\
    </li>'
	)
	
	var deck_id = $('#deck').data('deck_id');
	
	$.ajax({
	    url: '/decks/' + deck_id,
	    type: 'GET',
			dataType: 'json',
	    success: function(data) {
					$('#deck').html(''); // clear that shit

					$.tmpl('deck_list_card', data['cards']).appendTo('#deck');
	    },
			complete: function() {
				// pass
			}
	});
	
	$('.card .quantity_adjust .decrease').live('click', function() {
		var card_id = $(this).parents('.card').data('card_id');
		var deck_id = $(this).parents('#deck').data('deck_id');
		
		$.ajax({
		    url: '/delete_deck_cards',
		    type: 'DELETE',
				dataType: 'json',
		    data: { 
					deck_card: { deck_id: deck_id, card_id: card_id }
				},
		    success: function(data) {
						$('#deck').html(''); // clear that shit

						$.tmpl('deck_list_card', data['cards']).appendTo('#deck');
		    },
				complete: function() {
					// pass
				}
		});
		
		return false;
	});
	
	$('.card .quantity_adjust .increase').live('click', function() {
		var deck_id = $('#deck').data('deck_id');
		var multiverse_id = $(this).parents('.card').data('multiverse_id');
		
		$.ajax({
		    url: '/deck_cards/',
		    type: 'POST',
				dataType: 'json',
		    data: { 
					deck_card: { deck_id: deck_id, multiverse_id: multiverse_id }
				},
		    success: function(data) {
						$('#deck').html(''); // clear that shit

						$.tmpl('deck_list_card', data['cards']).appendTo('#deck');
		    },
				complete: function() {
					// pass
				}
		});
		
		
		return false;
	});
	
	$('.card').live('click', function(event) {
		var deck_id = $('#deck').data('deck_id');
		var multiverse_id = $(this).data('multiverse_id');
		
		$.ajax({
		    url: '/deck_cards/',
		    type: 'POST',
				dataType: 'json',
		    data: { 
					deck_card: { deck_id: deck_id, multiverse_id: multiverse_id }
				},
		    success: function(data) {
						$('#deck').html(''); // clear that shit

						$.tmpl('deck_list_card', data['cards']).appendTo('#deck');
		    },
				complete: function() {
					// pass
				}
		});
		
		//alert('selected: ' + $(this).data('multiverse_id'));
		return false;
	});
	
	$('#cardname').keydown(function(event) {
		// real-time searching of cards
		
		key_handlers = { 
			40: "down",
			38: "up",
			13: "enter"
		};
		
		if (event.keyCode in key_handlers) {
			switch (key_handlers[event.keyCode]) {
				case 'up':
					move_selection_up();
					
					break;
				case 'down':
					move_selection_down();
					
					break;
				case 'enter':
					make_selection(event.shiftKey);
					
					break;
			}
			
			return false;
		}
		
		setTimeout(function() {
			var search_field = $('#cardname');
			var results = $('#autocomplete_results');

			// if the field hasn't changed yet or the field is empty, return
			if ($(search_field).val() == last_search) { return; }
			if ($(search_field).val() == '') { 
				results.html('');
				return;
			}

			// if a search is in progress, queue the new search up and return
			if (search_in_progress) {
				queued_search = $(search_field).val();
				return;
			}

			last_search = $(search_field).val();
			search_in_progress = true;

			$.ajax({
			    url: '/autocompletions',
			    type: 'POST',
					dataType: 'json',
			    data: { 'cardname': $(search_field).val() },
			    success: function(data) {

							//if (data.length <= 0) { return; }

							results.html(''); // clear that shit

							$.tmpl('search_result', data).appendTo('#autocomplete_results');
			    },
					complete: function() {
						search_in_progress = false;
						if (queued_search) {
							$(search_field).keydown();
							queued_search = null;
						}
					}
			});
		}, 250);
	});
});

*/