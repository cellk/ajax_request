// Geolocalise an user
function geolocalise(callback) {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var coord = {
                lat: position.latitude,
                lng: position.longitide,
                accuracy: position.accuracy
            };
            callback(coord);
        }, function (err) {
            var errors = {
                1: 'Permission denied',
                2: 'Position unavailable',
                3: 'Request timeout'
            };
            callback(errors[err.code]);
        }, options);
    } else {
        callback(false);
    }
}

// Parse a JWT
function jwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

// Verify if str is a valid json string
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
