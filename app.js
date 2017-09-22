var TwitterPackage = require('twitter');

var secret = {
  consumer_key: process.env.TWITTER_KEYWORD_BOT_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_KEYWORD_BOT_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_KEYWORD_BOT_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_KEYWORD_BOT_ACCESS_TOKEN_SECRET
}
var client = new TwitterPackage(secret);


client.stream('user', {with: 'followings'},  function(stream) {

  stream.on('data', function(tweet) {
    console.log("----" + tweet.text);
  });

  stream.on('error', function(error) {
    console.log(error);
    throw error;
  });
});
