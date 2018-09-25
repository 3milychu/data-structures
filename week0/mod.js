var myError = new Error("Don't use 99!");

module.exports = {
    addTwo: function(input,callback){
        if (input == 99){
            callback(myError, null);
        } else {
            var result = input + 2;
            callback(null,result);
        }
    }
}