
_ = require('lodash');
const isTweet = function(tweet) {
  return _.isString(tweet.id_str) && _.isString(tweet.text) &&
  tweet.user && _.isString(tweet.user.screen_name)
}

const util = require('util');

class Filterer {
  constructor(keywords) {
    if (_.isString(keywords)) { keywords = keywords.split(","); }
    this.keywords = keywords;
  }

  filter(tweet) {
    if (! (isTweet(tweet))) { return; }
    if (! (tweet.entities && tweet.entities.symbols && tweet.entities.symbols.length > 0)) { return; }
    var retweeted = tweet.retweeted_status
    if (retweeted) { return; }
    var symbols = tweet.entities.symbols.map(function(x) { return x.text; });
    var user = tweet.user.screen_name;
    var text = tweet.text;
    
    var filteredInfo = {symbols: symbols, user: user, text: text, keyword: this.findKeyword(text)};
    return filteredInfo;
  }

  findKeyword(text) {
    var keyword = "";
    for (var k in this.keywords) {
      if (text.toLowerCase().includes(this.keywords[k])) {
        keyword = this.keywords[k];
        break;
      }
    }
    return keyword;
  }
};

module.exports = Filterer;