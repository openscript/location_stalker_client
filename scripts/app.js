// attributes
var opts = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
};

var data = {};

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
			addLog('Geolocation set');
		}, function(err) {
			addLog('Error occured during geolocation retrival..');
		}, opts);
	}
};

var sendData = function(data) {
	
}