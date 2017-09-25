

var fs = require('fs');
 

class ListFileReader {
  static readAsArray(filename) {
    var values = fs.readFileSync(filename, 'utf8').toString().split("\n");
    values = values.map(function(n) { return n.trim().toLowerCase(); });
    values = values.filter(function(n) { return n != '' && n != undefined });
    return values;
  }
};

module.exports = ListFileReader;