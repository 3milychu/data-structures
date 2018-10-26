var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
<<<<<<< HEAD
// AKIAJLYYBWDWZWOLSWLQ
AWS.config.secretAccessKey = process.env.AWS_KEY; 
// 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
=======
AWS.config.secretAccessKey = process.env.AWS_KEY; 
>>>>>>> d2e1f3da97acd775c671f22f4748aba1b1ab2055
AWS.config.region = "us-east-1";
var fs = require('fs');
var request = require('request');

var dynamodb = new AWS.DynamoDB();

var diaryEntries = [];

class DiaryEntry {
  constructor(primaryKey, date, mental, emotional, physical, weather, primary_events, reoccuring_thoughts, dominant_temporality) {
    this.pk = {};
    this.pk.N = primaryKey.toString();
    this.date = {}; 
    this.date.S = new Date(date).toDateString();
    this.mental = {};
    this.mental.N = mental;
    this.emotional = {};
    this.emotional.N = emotional;
    this.physical = {};
    this.physical.N = physical;
    this.weather = {};
    this.weather.S = weather;
    this.primary_events = {};
    this.primary_events.S = primary_events;
    this.reoccuring_thoughts = {};
    this.reoccuring_thoughts.S = reoccuring_thoughts;
    this.dominant_temporality = {};
    this.dominant_temporality.S = dominant_temporality;
  }
}
var csv = require("fast-csv");
var stream = fs.createReadStream("data/data.csv")
var diary = [];
csv
    .fromStream(stream, {headers : true})
    .on("data", function(data){
        var data = data;
       diary.push(data);
    })
    .on("end", function(){
        console.log("done");
        for (var i=0;i<diary.length;i++){
          var row = diary[i];
          diaryEntries.push(new DiaryEntry(row['primaryKey'], row['date'], row['mental'], row['emotional'], row['physical'], 
          row['weather'], row['primary_events'], row['reoccuring_thoughts'], row['dominant_temporality']));
        }
        // console.log(diaryEntries);
        for (i=0;i<diaryEntries.length;i++){
          var params = {};
          params.Item = diaryEntries[i]; 
          params.TableName = "deardiary";
          console.log(params);
        
          dynamodb.putItem(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          });
        }
    });