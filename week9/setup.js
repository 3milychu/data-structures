const { Client } = require('pg');
 // AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'chue134';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'sensordb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;
 // Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();
 // Sample SQL statement to create a table: 
 // var thisQuery = "DROP TABLE sensorData;"; 
// var thisQuery = "CREATE TABLE sensorData ( sensorValue integer, sensorTime timestamp DEFAULT current_timestamp );";
// var thisQuery = "DELETE FROM sensorData WHERE sensorTime BETWEEN '2018-12-16T02:46:52.269Z'  AND '2019-02-01T02:46:52.269Z'"
var thisQuery = "SELECT * FROM sensorData;";
 client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
})