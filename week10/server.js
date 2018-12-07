var express = require('express')
var app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');

// AWS RDS credentials (AA Data)
var db_credentials = new Object();
db_credentials.user = 'chue134';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'aadb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// AWS RDS credentials (Sensor Data)
var db_credentials2 = new Object();
db_credentials2.user = 'chue134';
db_credentials2.host = process.env.AWSRDS_EP2;
db_credentials2.database = 'sensordb';
db_credentials2.password = process.env.AWSRDS_PW;
db_credentials2.port = 5432;

// AWS DynamoDB credentials
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

console.log(db_credentials.host)

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
    var elem = document.querySelector('#map');
    elem.parentNode.removeChild(elem);
    target = document.querySelector('.results');
    map = document.createElement('div');
    map.id = "map";
    target.appendChild(map);
    var mymap = L.map('map').setView([40.734636,-73.994997], 13);
    
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        // accessToken: 'your.mapbox.access.token'
        accessToken: 'pk.eyJ1Ijoidm9ucmFtc3kiLCJhIjoiY2pveGF0aDV2MjIyOTNsbWxlb2hhMmR4dCJ9.JJdYD_jWgRwUeJkDWiBz3w'
    }).addTo(mymap);
    for (var i=0; i<map_data.length; i++) {
        ref = map_data[i];
        console.log(ref);
        meetings=[];
        meetings.push("<h2>" + ref.values[0]['location'] + "</h2>");
        meetings.push("<p>"+ref.values[0]['address']+"</p>");
        
        for (var j=0;j<ref.values.length;j++){
        meetings.push("<p><em>"+ref.values[j]['time_day'] + "s</em>" + " " + time(ref.values[j]['time_start'])+"-" +time(ref.values[j]['time_end'])+"</p>");
        }
        
        string_meetings = meetings.join("<br>");
        L.marker( [map_data[i].lat, map_data[i].long] ).bindPopup(string_meetings).addTo(mymap);
    }  
}

function time(decimal_time){
    decimal_time = decimal_time.toString();
     var hour = decimal_time.split(".")[0];
     var min = decimal_time.split(".")[1];
     var ampm;
     hour = (hour < 10) ? ("0" + hour) : hour;
     if(hour == 12) {
         hour = 12;
         ampm = "PM";
         } else if (hour>12) {
         hour = hour-12;
         ampm = "PM";
     } else {
         hour = hour;
         ampm = "AM";
     }
     if(min!=null){
         min = (min < 10) ? (min + "0") : min;
     } else {
         min = "00";
     }
     return hour + ":" + min + " " + ampm;
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


var html3 = `
var data =
`;

var html4= `
;
`;

app.get('/script2.js', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials2);

    // SQL query 
    var q = `SELECT sensorTime::timestamp::date as sensorday,
             COUNT(sensorValue) as num_obs
             FROM sensorData
             WHERE sensorValue>=11
             GROUP BY sensorday
             ORDER BY sensorday;`;

    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            var resp = html3 + JSON.stringify(qres.rows) + html4; 
            res.send(resp);
            client.end();
            console.log('1) responded to request for sensor graph');
        }
    });
});

var html5 = `
var data=
`;
var html6 = `
;
`;


// respond to requests for /deardiary
app.get('/script3.js', function(req, res) {

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();
    
    // DynamoDB (NoSQL) query
    var params = {
        TableName : "doodlediary",
        // KeyConditionExpression: "#tp = :tp and dt between :min and :max", // the query expression
        KeyConditionExpression: "#tp = :tp",
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#tp" : "temporality"
        },
        ExpressionAttributeValues: { // the query values
            ":tp": {S: "present"},
            // ":min": {S: new Date("October 1, 2018").toDateString()},
            // ":max": {S: new Date("October 10, 2018").toDateString()}
        }
    };

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            var resp = html5 + JSON.stringify(data.Items) + html6; 
            res.send(resp);
            console.log('3) responded to request for dear diary data');
        }
    });
});


// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});
