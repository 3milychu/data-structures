// npm install request
// mkdir data

var request = require('request');
var fs = require('fs');

// request('https://parsons.nyc/thesis-2018/', function(error, response, body){
//     if (!error && response.statusCode == 200) {
//         fs.writeFileSync('/home/ec2-user/environment/data/thesis2.txt', body);
//     }
//     else {console.log("Request failed!")}
// });


var entries = 11;
var i;

function format(n) {
    return (n < 10) ? ("0" + n) : n;
}

for(i=1;i<entries;i++) {
    var list = []
    var url = 'https://parsons.nyc/aa/m'+ format(i) +".html";
    list.push(url);
    
    for(i=0;i<list.length;i++){
        console.log("Requesting"+ list[i]);
        request(list[i], function(error, response, body){
    if (!error && response.statusCode == 200) {
        var path = "/home/ec2-user/environment/data/thesis" + list[i] + ".txt"
        console.log(path);
        fs.writeFileSync(path, body);
    }
    else {console.log("Request failed!")}
    })
};
}