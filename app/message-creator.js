

class MessageCreator {
  static create(obj) {
    var keyword = obj.keyword;
    if (!keyword) { keyword = obj.quotedKeyword + "-q"; }
    var header = (obj.officialAccount ? `@@${obj.user}` : obj.symbols);
    var message = `${header}[${keyword}]: @${obj.user}: ${obj.text}`;
    return message;
  }
};

module.exports = MessageCreator;


