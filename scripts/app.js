// attributes
var opts = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
};

// events
$(document).ready(function() {
	readFromSession();
	addLog('Location Stalker Client initialized');
});

$('#target').change(function() {
	if(/\w+/.exec($(this).val()).pop() != 'http') {
		$(this).val('http://' + $(this).val());
	};
	saveToSession();
});

$('#log .reset').click(function() {
	$('#log .messages').empty();
});

$('#create-session .initialize').click(function() {
	if($('#target').val()){
		$.ajax({
			type: 'GET',
			url: $('#target').val() + '/session/generate',
			dataType: 'json'
		}).done(function(res) {
			addLog('Set session:' + JSON.stringify(res));
			$('#create-session input[name="session-title"]').val(res.title);
			$('#create-session input[name="session-key"]').val(res.key);
		}).fail(function(err) {
			addLog('Error occured during session generation.');
		});
	}
});

$('#single-position .initialize').click(function() {
	setLoc('#single-position');
});

$('#changing-positions .initialize').click(function() {
	setLoc('#changing-positions');
});

$('#create-session form').submit(function() {
	var data = {};

	data['title'] = $(this).children('input[name="session-title"]').val();
	data['key'] = $(this).children('input[name="session-key"]').val();
	sendData(data, '/session');

	return false;
});

$('#single-position form').submit(function() {
	var data = {};

	data['latitude'] = $(this).children('input[name="latitude"]').val();
	data['longitude'] = $(this).children('input[name="longitude"]').val();
	data['altitude'] = $(this).children('input[name="altitude"]').val();
	data['accuracy'] = $(this).children('input[name="accuracy"]').val();
	data['session'] = $('#create-session input[name="session-key"]').val();
	sendData(data, '/map');

	return false;
});

$('#changing-positions form').submit(function() {
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
	if(isGeolocation()) {
		addLog('Asking browser for geolocation..');
		navigator.geolocation.getCurrentPosition(function(res) {
			$(target + ' input[name="latitude"]').val(res.coords.latitude);
			$(target + ' input[name="longitude"]').val(res.coords.longitude);
			$(target + ' input[name="altitude"]').val(res.coords.altitude);
			$(target + ' input[name="accuracy"]').val(res.coords.accuracy);
			addLog('Geolocation set: ' + JSON.stringify(res.coords));
		}, function(err) {
			addLog('Error occured during geolocation retrival: ' + err.message);
		}, opts);
	}
};

var sendData = function(data, route) {
	$.ajax({
		type: 'POST',
		url: $('#target').val() + route,
		data: data,
		dataType: 'json'
	}).done(function(res) {
		addLog('Data sent: ' + JSON.stringify(data));
		addLog('Received: ' + JSON.stringify(res));
	});
}

var saveToSession = function() {
	if(isStorage()) {
		sessionStorage.setItem('target', $('#target').val());
	}
}

var readFromSession = function() {
	if(isStorage()) {
		$('#target').val(sessionStorage.getItem('target'));
	}
}

var isGeolocation = function() {
	if('geolocation' in navigator) {
		return true;
	} else {
		addLog('Geolocation is not supported by browser.');
		return false;
	}
}

var isStorage = function() {
	if(typeof(Storage) !== 'undefined') {
		return true;
	} else {
		addLog('Storage is not supported by browser.');
		return false;
	}
}