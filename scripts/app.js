// attributes
var opts = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
};

// events
$(document).ready(function() {
	addLog('Location Stalker Client initialized');
});

$('#log .reset').click(function() {
	$('#log .messages').empty();
});

$('#single-position .initialize').click(function() {
	setLoc('#single-position');
});

$('#changin-positions .initialize').click(function() {
	setLoc('#changin-positions');
});

$('#single-position form').submit(function() {
	var data = {};
	data['latitude'] = $(this).children('input[name="latitude"]').val();
	data['longitude'] = $(this).children('input[name="longitude"]').val();
	data['altitude'] = $(this).children('input[name="altitude"]').val();
	data['accuracy'] = $(this).children('input[name="accuracy"]').val();
	sendData(data);

	return false;
});

$('#changin-positions form').submit(function() {
	if($(this).children('.stop').hasClass('hide')){
		$(this).children('.start').addClass('hide');
		$(this).children('.stop').removeClass('hide');
	} else {
		$(this).children('.start').removeClass('hide');
		$(this).children('.stop').addClass('hide');
	}
	return false;
});

// functions
var addLog = function(message) {
	$('#log .messages').prepend($('<li>').text('[' + $.formatDateTime('dd.mm.y hh:ii:ss', new Date()) + '] ~ ' + message));
};

var setLoc = function(target) {
	if('geolocation' in navigator) {
		addLog('Ask browser for geolocation..');
		navigator.geolocation.getCurrentPosition(function(res) {
			$(target + ' input[name="latitude"]').val(res.coords.latitude);
			$(target + ' input[name="longitude"]').val(res.coords.longitude);
			$(target + ' input[name="altitude"]').val(res.coords.altitude);
			$(target + ' input[name="accuracy"]').val(res.coords.accuracy);
			addLog('Geolocation set: ' + JSON.stringify(res.coords));
		}, function(err) {
			addLog('Error occured during geolocation retrival..');
		}, opts);
	}
};

var sendData = function(data) {
	$.ajax({
		type: 'POST',
		url: $('#target').val(),
		data: data,
		success: function() {
			addLog('Data sent: ' + JSON.stringify(data))
		},
		dataType: 'json'
	});
}