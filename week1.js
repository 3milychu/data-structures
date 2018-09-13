// npm install request
// mkdir data

var request = require('request');
var fs = require('fs');

var entries = 11;
var i;

// Format numbers so 0= 00, 1=01, 10= 10
function format(n) {
    return (n < 10) ? ("0" + n) : n;
}

// Testing the format of the path construction
// for (var i=1;i<entries;i++){
//     var path = "https://parsons.nyc/aa/m" + format(i) +".html";
//     console.log(path);
// }

// Construct a function for each path and store
var funcs = [];

function getEachPage(i) {
    return function() {
        var path = "https://parsons.nyc/aa/m" + format(i) +".html";
        request(path, function(error,response,body){
         if(!error & response.statusCode == 200){
             var save_path = '/home/ec2-user/environment/data/m' + format(i)+ '.txt';
             fs.writeFileSync(save_path, body);
             console.log(path + " saved successfully!");
         } else {
             console.log("Request failed");
         }
        })
 }
}

// Create the functions for each page
for (var i=1; i<entries; i++) {
    funcs[i] = getEachPage(i);
}

// Run each function
for (var j=1;j<entries; j++) {
  funcs[j]();                     
}
