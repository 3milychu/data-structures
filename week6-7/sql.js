var request = require('request'); 
var async = require('async'); 
var fs = require('fs');

const { Client } = require('pg');

// // AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'chue134';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'aadb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
// const client = new Client(db_credentials);
// client.connect();


// var thisQuery = "DROP TABLE aadata;"; 
// // // var thisQuery = "DELETE FROM aadata;";
// // // var thisQuery = "SELECT * FROM aadata;";
// // // var thisQuery = "SELECT time_day, time_start, time_end, location FROM aadata WHERE time_day = 'Monday';";
// // // var thisQuery = "SELECT lng FROM aalocations;";
// var thisQuery = "CREATE TABLE aadata (time_day varchar(25), time_start double precision, time_end double precision, name varchar(75), location varchar(75), address varchar(75), lat double precision, long double precision, region varchar(75), type varchar(150), interests varchar(150));";

// client.query(thisQuery, (err, res) => {
//     console.log(err, res);
//     client.end();
// });

function format(n) {
    return (n < 10) ? ("0" + n) : n;
}


for (var i=1;i<11;i++){
    var file = format(i);
    var json = fs.readFileSync("data/sql_m" + file + ".json");
    var data = JSON.parse(json);

async.eachSeries(data, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    
    // handle single apostrophes in names
    var name = value.name;
    var test1 = name.indexOf('\'') >= 0;
    if (test1 == true ){
        name = name.replace(/'/g,"''");
    } else {
        name = value.name;
    }
    
    // handle single apostrophes in locations
    var location = value.location;
    var test2 = location.indexOf('\'') >= 0;
    if (test2 == true ){
        location = location.replace(/'/g,"''");
    } else {
        location = value.location;
    }
    
    var thisQuery = "INSERT INTO aadata VALUES (E'" + value.day + "', '" + value.start + "', '" + value.end + "', '" + name + "', E'" + location + "', E'" + value.address + "', '" + value.lat + "', '" + value.long + "', '" + value.region + "', '" + value.type + "', '" + value.interest + "');";
   
    client.query(thisQuery, (err, res) => {
        console.log(value, err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 

};