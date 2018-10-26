var add = require('./mod.js');

add.addTwo(11, function(err, result){
    if(err) throw err;
    else {
        console.log(result)
    }
})