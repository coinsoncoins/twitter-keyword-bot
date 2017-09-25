

var fs = require('fs');
 

class ListFileReader {
  static readAsArray(filename) {
    var values = fs.readFileSync(filename, 'utf8').toString().split("\n");
    values = values.filter(function(n) { return n.trim() != '' && n != undefined });
    return values;
  }
};

module.exports = ListFileReader;