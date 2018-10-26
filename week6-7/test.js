var fs = require('fs');
var json = fs.readFileSync("data/1.json");
var data = JSON.parse(json);

var mondays = data[0]['meeting_times']['Tuesday'];
var test = mondays.length>0;
if(test === true){
    for(var i=0;i<mondays.length;i++){
        console.log(mondays[i]['details']['interest']);
    }
}