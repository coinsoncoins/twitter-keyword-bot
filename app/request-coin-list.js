
const axios = require('axios');
var fs = require('fs');
 
axios.get('https://api.coinmarketcap.com/v1/ticker/')
  .then(response => {
    coinDB = response.data;
    coins = coinDB.map(function(x) { return x.symbol; });
    fs.writeFileSync(__dirname + '/symbols.list', coins.join("\n"));
  })
  .catch(error => {
    console.log(error);
  });
