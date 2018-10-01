var request = require('request'); // npm install request
var async = require('async'); // npm install async
var fs = require('fs');

var apiKey = process.env.TAMU_KEY;
console.log(apiKey);

// Load data from json
var addresses = [];
var json = fs.readFileSync("../week2/data/parsed_m04.json");
var data = JSON.parse(json);

for (var i in data) {
    var address = data[i].meeting_address;
    addresses.push(address);
}

// test with one address
// addresses.push(data[0].meeting_address);
console.log(addresses);

var meetingsData = []

// // eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
    var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    apiRequest += 'streetAddress=' + value.split(' ').join('%20');
    apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
    apiRequest += '&format=json&version=4.01';
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            
            // access deeply nested OutputGeocode
            var obj = JSON.parse(body);
            var lat = obj['OutputGeocodes'][0]['OutputGeocode']['Latitude'];
            var lng = obj['OutputGeocodes'][0]['OutputGeocode']['Longitude'];
            
            // Push to meetingsData array
            meetingsData.push({
			meeting_address: obj.InputAddress['StreetAddress'],
			latlong: {
                lat: lat,
                lng: lng
			    }
			});
        }
    });
    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('data/geolocations.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log('Number of meetings in this zone: ');
    console.log(meetingsData.length);
});