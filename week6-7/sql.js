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

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to create a table: 
// Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE aadata;"; 
// var thisQuery = "CREATE TABLE aadata (time_day varchar(25), time_start varchar(25), time_end varchar(25));";
// Sample SQL statement to query the entire contents of a table: 
// var thisQuery = "SELECT * FROM aadata;";
var thisQuery = "SELECT address FROM aadata;";
// var thisQuery = "SELECT address FROM aalocations;";
// var thisQuery = "SELECT lng FROM aalocations;";
// var thisQuery = "CREATE TABLE aadata (time_day varchar(25), time_start varchar(25), time_end varchar(25), name varchar(75), location varchar(75), address varchar(75), lat double precision, long double precision, region varchar(75), type varchar(150), interests varchar(150));";
// var thisQuery = "CREATE TABLE aadata (time_day varchar(25), time_start varchar(25), time_end varchar(25), name varchar(75));";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});

// function format(n) {
//     return (n < 10) ? ("0" + n) : n;
// }


// for (var i=1;i<11;i++){
//     var file = format(i);
//     var json = fs.readFileSync("data/sql_m" + file + ".json");
//     var data = JSON.parse(json);

// async.eachSeries(data, function(value, callback) {
//     const client = new Client(db_credentials);
//     client.connect();
    
//     var thisQuery = "INSERT INTO aadata VALUES (E'" + value.day + "', '" + value.start + "', '" + value.end + "', '" + value.name + "', '" + value.location + "', '" + value.address + "', '" + value.lat + "', '" + value.long + "', '" + value.region + "', '" + value.type + "', '" + value.interest + "');";
   
//     client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
//     setTimeout(callback, 1000); 
// }); 

// };