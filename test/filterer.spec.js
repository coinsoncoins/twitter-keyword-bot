var expect    = require("chai").expect;
var filterer = require("../app/filterer");

describe("Twitter Filterer", function() {
  it("has message for tweet with symbols", function() {
    tweet = {
      id_str: '911960555145109504',
      text: 'You should buy $EDG',
      user: {
        screen_name: '@coinsoncoins'
      },
      entities: {
        symbols: [ { text: 'EDG', indices: [ 15, 19 ] } ]
      }
    }
    obj = filterer.filter(tweet);
    expect(obj).to.deep.equal({text: 'You should buy $EDG', symbols: ['EDG'], user: '@coinsoncoins'});
  });

  it("returns nothing for an invalid tweet", function() {
    tweet = { // no user
      id_str: '911960555145109504',
      text: 'You should buy $EDG'
    }
    expect(filterer.filter(tweet)).to.not.be.ok;
  });

  it("passes back the right keyword", function() {
    tweet = {
      id_str: '911960555145109504',
      text: 'You should burn $EDG',
      user: {
        screen_name: '@coinsoncoins'
      },
      entities: {
        symbols: [ { text: 'EDG', indices: [ 15, 19 ] } ]
      }
    }
    obj = filterer.filter(tweet);
    obj = filterer.prepareMessage(obj, ["burn"]);
    console.log(obj);
    expect(obj.keyword).to.equal("burn");
  });

});