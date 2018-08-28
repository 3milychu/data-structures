// npm install request
// mkdir data

var request = require('request');
var fs = require('fs');

// request('https://parsons.nyc/thesis-2018/', function(error, response, body){
//     if (!error && response.statusCode == 200) {
//         fs.writeFileSync('/home/ec2-user/environment/data/thesis.txt', body);
//     }
//     else {console.log("Request failed!")}
// });

var entries = 11;
var i;
for(i=0;i<entries.length;i++) {
    if(i<10) {
            request('https://parsons.nyc/aa/m0'+i, function(error, response, body){
        if (!error && response.statusCode == 200) {
            fs.writeFileSync('/home/ec2-user/environment/data/thesis'+i+".txt", body);
        }
        else {console.log("Request failed!")}
    } else {
         request('https://parsons.nyc/aa/m'+i, function(error, response, body){
        if (!error && response.statusCode == 200) {
            fs.writeFileSync('/home/ec2-user/environment/data/thesis'+i+".txt", body);
        }
        else {console.log("Request failed!")}
    }
});
    
}