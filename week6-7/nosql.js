// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "doodlediary",
    KeyConditionExpression: "#tp = :tp and dt between :min and :max", // the query expression
    // KeyConditionExpression: "#tp = :tp",
    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
        "#tp" : "temporality"
    },
    ExpressionAttributeValues: { // the query values
        ":tp": {S: "present"},
        ":min": {S: new Date("October 1, 2018").toDateString()},
        ":max": {S: new Date("October 10, 2018").toDateString()}
    }
};

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});