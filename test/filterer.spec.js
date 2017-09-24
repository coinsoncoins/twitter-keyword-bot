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
    //expect(JSON.stringify(obj)).to.equal(JSON.stringify({text: 'You should buy $EDG', symbols: ['EDG'], name: '@coinsoncoins'}));
    expect(obj).to.deep.equal({text: 'You should buy $EDG', symbols: ['EDG'], user: '@coinsoncoins'});
  })

});