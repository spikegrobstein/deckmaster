// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var last_search = '';
var search_in_progress = null;
var queued_search = null;

$(function() {
	// build some templates
	
	$.template(
		'search_result', 
		'<li>\
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
	
	$('#cardname').keydown(function(event) {
		// real-time searching of cards
		
		setTimeout(function() {
			var search_field = $('#cardname');

				if ($(search_field).val() == last_search) { return; }

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
				        var results = $('#autocomplete_results');

								if (data.length <= 1) { return; }

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

