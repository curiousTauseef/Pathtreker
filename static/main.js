(function() {
var shutmedown = true;
var map;
var geocoder;

function geocodeName(geocode) {
	return geocode.address_components[0].short_name + " " + geocode.address_components[1].short_name;
}

var lastQuery = {};

var sides = {"L": "left", "R": "right"}

function submitForm() {
	// Canonize address through Google Maps Geocoding API
	var searchStart = $("#search-form input[name='start']")[0].value;
	var searchEnd = $("#search-form input[name='end']")[0].value;
	var restrictions = {
		country: "CA",
		locality: "Toronto"
	};
	var startResult;
	geocoder.geocode({
		address: searchStart,
		componentRestrictions: restrictions
	}, function(results, status) {
		if (status != google.maps.GeocoderStatus.OK || results.length == 0) {
			alert("start address is invalid");
			return;
		}
		startResult = results[0];
		geocoder.geocode({
			address: searchEnd,
			componentRestrictions: restrictions
		}, function(results, status) {
			if (status != google.maps.GeocoderStatus.OK || results.length == 0 ) {
				alert("end address is invalid");
				return;
			}
			lastQuery.start = geocodeName(startResult);
			lastQuery.end = geocodeName(results[0]);
			$.get("/direction", "start=" + encodeURIComponent(lastQuery.start)
				+ "&end=" + encodeURIComponent(lastQuery.end), handleDirectionResponse, "json")
			.fail(function() {
				alert("Network error");
			});
		});
	});
	return false;
}

function handleDirectionResponse(data, textStatus, jqXHR) {
	console.log(data);
	if (data.error != null) {
		alert(data.error);
		return;
	}
	$("#direction-length").text("Distance: " + data.length);
	var parts = [];
	for (var i = 0; i < data.path.length; i++) {
		var p = data.path[i];
		if (p.action == "along") {
			parts.push($("<div>").text("Head " + p.direction + " along " + p.from.name + " to " + p.to.name));
		} else if (p.action == "turn") {
			parts.push($("<div>").text("Turn " +
				p.direction + " onto " + p.to.name));
		} else if (p.action == "arrive") {
			parts.push($("<div>").text(lastQuery.end + " is on the " + sides[p.side]));
		}
		if (p.distance) {
			parts.push($("<div>").text("(" + p.distance + " km)"));
		}
	}
	$("#directions").replaceWith(parts);
}

function initUi() {
	$("#search-form").on("submit", submitForm);
}
function initMap() {
	initUi();
	geocoder = new google.maps.Geocoder();
	if (shutmedown) return;
	map = new google.maps.Map(document.getElementById("map"),
		{
			center: {lat: 43.6592125, lng: -79.4386709},
			zoom: 13
		});
}
window.initMap = initMap;
})();