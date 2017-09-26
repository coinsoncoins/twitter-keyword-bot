var expect    = require("chai").expect;
var Filterer = require("../app/filterer");

keywords = ["burn", "moon", "announcement", "buy"];
whitelistedSymbols = ["EDG"];
symbolsToIgnore = ["USD", "SPY"];
usersToIgnore = ["stocknewsbot", "annoyingnewsfeed"];
textToIgnore = ["insider selling", "public offering"];

const filterer = new Filterer(keywords, whitelistedSymbols, symbolsToIgnore, usersToIgnore, textToIgnore);

createTweet = function() {
  tweet = { // this tweet should return an object
    id_str: '911960555145109504',
    text: 'You should buy $EDG',
    user: {
      screen_name: 'coinsoncoins'
    },
    entities: {
      symbols: [ { text: 'EDG', indices: [ 15, 19 ] } ]
    }
  }
  return tweet;
}

describe("Twitter Filterer", function() {
  it("has message for tweet with symbols in whitelist", function() {
    tweet = createTweet();
    obj = filterer.filter(tweet);
    expect(obj).to.deep.equal({text: 'You should buy $EDG', symbols: ['EDG'], user: 'coinsoncoins', keyword: "buy"});
    tweet.entities.symbols[0].text = tweet.entities.symbols[0].text.toLowerCase();
    expect(obj).to.deep.equal({text: 'You should buy $EDG', symbols: ['EDG'], user: 'coinsoncoins', keyword: "buy"});
  });

  it("returns nothing for an invalid tweet", function() {
    tweet = createTweet();
    delete tweet.user;
    expect(filterer.filter(tweet)).to.not.be.ok;
  });

  it("returns nothing for a symbol not in the whitelist", function() {
    tweet = createTweet();
    tweet.entities.symbols[0].text = 'USDJPY';
    expect(filterer.filter(tweet)).to.not.be.ok;
  });

  it("passes back the right keyword if it's in the quoted_status", function() {
    tweet = {
      id_str: '911960555145109504',
      text: 'Hey look at this $EDG',
      user: {
        screen_name: 'coinsoncoins'
      },
      quoted_status: {
        text: "You should buy $EDG"
      },
      entities: {
        symbols: [ { text: 'EDG', indices: [ 15, 19 ] } ]
      }
    }
    tweet = createTweet();
    tweet.text = "hey";
    tweet.quoted_status = { text: "You should buy $EDG" };
    obj = filterer.filter(tweet);
    expect(obj).to.deep.equal({text: 'hey', symbols: ['EDG'], user: 'coinsoncoins', 
      keyword: "", quotedText: "You should buy $EDG", quotedKeyword: "buy"});
  });


  it("returns nothing for symbol in the symbolsToIgnore list", function() {
    tweet = createTweet();
    tweet.entities.symbols.push({ text: 'USD', indices: [ 0, 4 ] });
    expect(filterer.filter(tweet)).to.not.be.ok;
    tweet.entities.symbols[1].text = 'usd';
    expect(filterer.filter(tweet)).to.not.be.ok;
  });


  it("returns nothing for user in the usersToIgnore list", function() {
    tweet = createTweet();
    tweet.user.screen_name = 'stocknewsBOT'
    expect(filterer.filter(tweet)).to.not.be.ok;
  });

  it("returns nothing for text in the textToIgnore list", function() {
    tweet = createTweet();
    tweet.text = 'Insider Selling: Halcon Resources Corporation $HK Major Shareholder Sells 830,000 Shares of Stock';
    expect(filterer.filter(tweet)).to.not.be.ok;
  });

});