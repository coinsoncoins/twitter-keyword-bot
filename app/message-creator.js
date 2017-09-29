

class MessageCreator {
  static create(obj) {
    var keyword = obj.keyword;
    if (!keyword) { keyword = obj.quotedKeyword + "-q"; }
    var shortSymbols = obj.symbols;
    if( obj.symbols.length > 2 ) {
      shortSymbols.splice(2);
      shortSymbols.push('...');
    }
    var header = (obj.officialAccount ? `@@${obj.user}` : shortSymbols);
    var message = `${header}[${keyword}]: @${obj.user}: ${obj.text}`;
    return message;
  }
};

module.exports = MessageCreator;


