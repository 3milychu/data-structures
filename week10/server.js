var express = require('express');
var app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');

// AWS RDS credentials
var db_credentials = new Object();
db_credentials.user = 'chue134';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'aadb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// AWS DynamoDB credentials
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var script1 = `
var data;
var map_data;

function getdata(callback) {
 Array.prototype.groupBy = function (props) {
   var arr = this;
   var partialResult = {};
   
   arr.forEach(el=>{
   
       var grpObj = {};
       
       props.forEach(prop=>{
             grpObj[prop] = el[prop]
       });
       
       var key = JSON.stringify(grpObj);
       
       if(!partialResult[key]) partialResult[key] = [];
       
       partialResult[key].push(el);
       
   });
   
   var finalResult = Object.keys(partialResult).map(key=>{
      var keyObj = JSON.parse(key);
      keyObj.values = partialResult[key];
      return keyObj;
   })
   
   return finalResult;
}
data =`
var script2 = `
;
map_data = data.groupBy(['lat','long']);
console.log(map_data);
callback(map_data);
}
function getmap(data) {
    var mymap = L.map('map').setView([40.734636,-73.994997], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        // accessToken: 'your.mapbox.access.token'
        accessToken: 'pk.eyJ1Ijoidm9ucmFtc3kiLCJhIjoiY2pveGF0aDV2MjIyOTNsbWxlb2hhMmR4dCJ9.JJdYD_jWgRwUeJkDWiBz3w'
    }).addTo(mymap);
    for (var i=0; i<map_data.length; i++) {
        ref = map_data[i];
        console.log(ref.values);
        L.marker( [map_data[i].lat, map_data[i].long] ).bindPopup(ref.values.length + ": " + JSON.stringify(map_data[i].values)).addTo(mymap);
    }  
}

getdata(getmap);
`
app.get('/script.js', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

var selected_day = "Monday";
var selected_start_time = "7:00 AM";

var thisQuery = `SELECT * FROM aadata`;
// var thisQuery = `SELECT lat, long, json_agg(json_build_object('loc', location, 'address', address, 'time_start', time_start, 'name', name, 'day', time_day, 'type', type, 'time_end', time_end)) as meetings
//              FROM aadata
//              WHERE day = ` + selected_day + 
//              `GROUP BY lat, long
//              ;`;

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            var resp = script1 + JSON.stringify(qres.rows) + script2;
            res.send(resp);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});

app.get('/other', function(req, res) {
      res.send("Hello world");
});

// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});