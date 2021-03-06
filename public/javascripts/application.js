// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults



/*
function(event) {
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
}
*/

$(function() {
	$('#cardname').dm_search($('#autocomplete_results'),
		function(card, event) {
			var deck_id = $('#deck').data('deck_id');
			var multiverse_id = card.data('multiverse_id');

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
		}
	); // end dm_search() function
	
	// do deck-related things if there's a deck element on the page
	if ($('#deck').length) {
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
		
	}

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