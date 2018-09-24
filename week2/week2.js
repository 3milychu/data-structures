var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('data/m04.txt');
var $ = cheerio.load(content);

var toTitleCase = function (str) {
	str = str.toLowerCase().split(' ');
	for (var i = 0; i < str.length; i++) {
		str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
	}
	return str.join(' ');
};

var table = $('table').eq(2);
var cell = table.find($('td'));

var save_path = 'data/parsed_m04.json';
var dict = [];
    
cell.each(function(i,elem){
    if(i%3 === 0 | i ===0 ){
        var myKey = $(elem).children().eq(2).text().trim().toString();
        var myContent = $(elem).contents().map(function() {
                if (this.type === 'text')
                  return $(this).text().trim();
            }).get();
        myContent = myContent.splice(2,2);
        myKey = toTitleCase(myKey)
        myKey= myKey.replace("-", "");
        myKey = myKey.trim();
        dict.push({
				key: myKey,
				value: myContent
			});
    }
})

// console.log(dict);
dict = JSON.stringify(dict);

fs.writeFile("data/parsed_m04.json", dict, 'utf8')

