var expect    = require("chai").expect;
var Filterer = require("../app/filterer");

keywords = ["burn", "moon", "announcement", "buy"];
whitelistedSymbols = ["EDG"];
symbolsToIgnore = ["USD", "SPY"];
usersToIgnore = ["stocknewsbot", "annoyingnewsfeed"];
textToIgnore = ["insider selling", "public offering"];

const filterer = new Filterer(keywords, whitelistedSymbols, symbolsToIgnore, usersToIgnore, textToIgnore);

describe("Twitter Filterer", function() {
  it("has message for tweet with symbols in whitelist", function() {
    tweet = {
      id_str: '911960555145109504',
      text: 'You should buy $EDG',
      user: {
        screen_name: 'coinsoncoins'
      },
      entities: {
        symbols: [ { text: 'EDG', indices: [ 15, 19 ] } ]
      }
    }
    obj = filterer.filter(tweet);
    expect(obj).to.deep.equal({text: 'You should buy $EDG', symbols: ['EDG'], user: 'coinsoncoins', keyword: "buy"});
    tweet.entities.symbols[0].text = tweet.entities.symbols[0].text.toLowerCase();
    expect(obj).to.deep.equal({text: 'You should buy $EDG', symbols: ['EDG'], user: 'coinsoncoins', keyword: "buy"});
  });

  it("returns nothing for an invalid tweet", function() {
    tweet = { // no user
      id_str: '911960555145109504',
      text: 'You should buy $EDG'
    }
    expect(filterer.filter(tweet)).to.not.be.ok;
  });

  it("returns nothing for a symbol not in the whitelist", function() {
    tweet = {
      id_str: '911960555145109504',
      text: 'You should buy $EDG',
      user: {
        screen_name: 'coinsoncoins'
      },
      entities: {
        symbols: [ { text: 'USDJPY', indices: [ 15, 19 ] } ]
      }
    }
    expect(filterer.filter(tweet)).to.not.be.ok;
  });

  it("passes back the right keyword", function() {
    tweet = {
      id_str: '911960555145109504',
      text: 'You should burn $EDG',
      user: {
        screen_name: 'coinsoncoins'
      },
      entities: {
        symbols: [ { text: 'EDG', indices: [ 15, 19 ] } ]
      }
    }
    obj = filterer.filter(tweet);
    expect(obj.keyword).to.equal("burn");
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
    obj = filterer.filter(tweet);
    expect(obj).to.deep.equal({text: 'Hey look at this $EDG', symbols: ['EDG'], user: 'coinsoncoins', 
      keyword: "", quotedText: "You should buy $EDG", quotedKeyword: "buy"});
  });


  // it("returns nothing for symbol in the symbolsToIgnore list", function() {
  //   tweet = {
  //     id_str: '911960555145109504',
  //     text: '$USD is strong',
  //     user: {
  //       screen_name: 'coinsoncoins'
  //     },
  //     entities: {
  //       symbols: [ { text: 'BTC', indices: [ 0, 4 ]}, { text: 'USD', indices: [ 0, 4 ] } ]
  //     }
  //   }
  //   obj = filterer.filter(tweet);
  //   expect(obj).to.not.be.ok;
  // });

  it("returns nothing for user in the usersToIgnore list", function() {
    tweet = {
      id_str: '911960555145109504',
      text: 'You should buy $EDG',
      user: {
        screen_name: 'stocknewsBOT'
      },
      entities: {
        symbols: [ { text: 'EDG', indices: [ 15, 19 ] } ]
      }
    }
    obj = filterer.filter(tweet);
    expect(obj).to.not.be.ok;
  });

  // it("returns nothing for text in the textToIgnore list", function() {
  //   tweet = {
  //     id_str: '911960555145109504',
  //     text: 'Insider Selling: Halcon Resources Corporation $HK Major Shareholder Sells 830,000 Shares of Stock',
  //     user: {
  //       screen_name: 'coinsoncoins'
  //     },
  //     entities: {
  //       symbols: [ { text: 'HK', indices: [ 15, 19 ] } ]
  //     }
  //   }
  //   obj = filterer.filter(tweet);
  //   expect(obj).to.not.be.ok;
  // });

});