var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY; 
AWS.config.region = "us-east-1";
var fs = require('fs');
var request = require('request');

var dynamodb = new AWS.DynamoDB();

var diaryEntries = [];

class DiaryEntry {
  constructor(dominant_temporality, date, mental, emotional, physical, weather, primary_events, reoccuring_thoughts, doodle) {
    this.temporality = {};
    this.temporality.S = dominant_temporality;
    this.dt = {}; 
    this.dt.S = new Date(date).toDateString();
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
    this.doodle = {};
    this.doodle.N = doodle;
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
          var pk;
          if(row['dominant_temporality']=="past"){
            pk = 0;
          } else if(row['dominant_temporality']=="present"){
            pk = 1;
          } else if(row['dominant_temporality']=="future"){
            pk =3;
          }
          diaryEntries.push(new DiaryEntry(row['dominant_temporality'], row['date'], row['mental'], row['emotional'], row['physical'], 
          row['weather'], row['primary_events'], row['reoccuring_thoughts'], row['doodle']));
        }
        // console.log(diaryEntries);
        for (i=0;i<diaryEntries.length;i++){
          var params = {};
          params.Item = diaryEntries[i]; 
          params.TableName = "doodlediary";
          console.log(params);
        
          dynamodb.putItem(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          });
        }
    });