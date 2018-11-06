var fs = require('fs');


function format(n) {
    return (n < 10) ? ("0" + n) : n;
}

for(var f=1;f<10;f++){
    count(f);
}

function count(f){
    var file = format(f);
    var json = fs.readFileSync("aadata/parsed_data/parsed_m0" + f + ".json");
    var data = JSON.parse(json);
    console.log(data.length);
}