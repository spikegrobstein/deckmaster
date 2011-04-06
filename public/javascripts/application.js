// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var last_search = '';
var search_in_progress = null;
var queued_search = null;

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

$(function() {
	// build some templates
	
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
	
	var deck_id = $('#deck').data('deck_id');
	
	$.ajax({
	    url: '/decks/' + deck_id,
	    type: 'GET',
			dataType: 'json',
	    success: function(data) {
					$('#deck').html(''); // clear that shit

					$.tmpl('search_result', data).appendTo('#deck');
	    },
			complete: function() {
				// pass
			}
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

						$.tmpl('search_result', data).appendTo('#deck');
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

