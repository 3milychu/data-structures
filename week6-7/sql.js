var request = require('request'); 
var async = require('async'); 
var fs = require('fs');

const { Client } = require('pg');

// // AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'chue134';
db_credentials.host = 'aadb.chdfkvzuvifk.us-east-2.rds.amazonaws.com';
db_credentials.database = 'aadb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// // // Connect to the AWS RDS Postgres database
// const client = new Client(db_credentials);
// client.connect();

// // Sample SQL statement to create a table: 
// var thisQuery = "CREATE TABLE aalocations (address varchar(100), lat double precision, lng double precision);";
// // Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE aadata;"; 
// // Sample SQL statement to query the entire contents of a table: 
// var thisQuery = "SELECT * FROM aalocations;";
// var thisQuery = "SELECT address FROM aalocations;";
// var thisQuery = "SELECT lng FROM aalocations;";
// var thisQuery = "CREATE TABLE aadata (time_day varchar(25), time_start varchar(25), time_end varchar(25), name varchar(75), location varchar(75), address varchar(75), region varchar(75), type varchar(150), interests varchar(150));";

// client.query(thisQuery, (err, res) => {
//     console.log(err, res);
//     client.end();
// });

var json = fs.readFileSync("data/1.json");
var data = JSON.parse(json);
var region = 1;

var result = [];

for(var i in data)
result.push(data[i]);

async.eachSeries(data, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    
    var id = result.indexOf(value);
    // insert Monday entries
    var mondays = data[id]['meeting_times']['Monday'];
    var test = mondays.length>0;
    if(test === true){
        for(var i=0;i<mondays.length;i++){
            var day = "Monday";
            var topic = mondays[i]['details']['topic'];
            var interest = mondays[i]['details']['interest'];
            if (topic != undefined && interest != undefined){
                var thisQuery = "INSERT INTO aadata VALUES (E'" + day + "', " + value.meeting_times.Monday.start + ", " + value.meeting_times.Monday.end + value.meeting_name + "', " + value.location_name + ", " + value.meeting_address + region + "', " + value.meeting_times.Monday.details.topic + ", " + value.meeting_times.Monday.details.interest +");";
            } else if (topic == undefined && interest == undefined){
                var thisQuery = "INSERT INTO aadata  VALUES (E'" + day + "', " + value.meeting_times.Monday.start + ", " + value.meeting_times.Monday.end + value.meeting_name + "', " + value.location_name + ", " + value.meeting_address + region + "', " + "null" + ", " + "null" +");";
            } else if (topic != undefined && interest == undefined){
                var thisQuery = "INSERT INTO aadata  VALUES (E'" + day + "', " + value.meeting_times.Monday.start + ", " + value.meeting_times.Monday.end + value.meeting_name + "', " + value.location_name + ", " + value.meeting_address + region + "', " + value.meeting_times.Monday.details.topic + ", " + "null" +");";
            } else if (topic == undefined && interest != undefined){
                var thisQuery = "INSERT INTO aadata VALUES (E'" + day + "', " + value.meeting_times.Monday.start + ", " + value.meeting_times.Monday.end + value.meeting_name + "', " + value.location_name + ", " + value.meeting_address + region + "', " + "null" + ", " + value.meeting_times.Monday.details.interest +");";
            }
        }
    }
    
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 