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
const client = new Client(db_credentials);
client.connect();

// // Sample SQL statement to create a table: 
// var thisQuery = "CREATE TABLE aalocations (address varchar(100), lat double precision, lng double precision);";
// // Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE aalocations;"; 
// // Sample SQL statement to query the entire contents of a table: 
// var thisQuery = "SELECT * FROM aalocations;";
// var thisQuery = "SELECT address FROM aalocations;";
var thisQuery = "SELECT lng FROM aalocations;";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});

// var json = fs.readFileSync("../week3/data/geolocations.json");
// var data = JSON.parse(json);

// async.eachSeries(data, function(value, callback) {
//     const client = new Client(db_credentials);
//     client.connect();
//     var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.meeting_address + "', " + value.latlong.lat + ", " + value.latlong.lng + ");";
//     client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
//     setTimeout(callback, 1000); 
// }); 