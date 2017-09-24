# twitter-keyword-bot

scans a user's twitterfeed, looks for select keywords, and sends the tweet to a telegram bot

### how to deploy

create a droplet on digital ocean.  then log into the droplet and create the /var/www directory
``` 
git clone https://github.com/coinsoncoins/twitter-keyword-bot.git
cd twitter-keyword-bot
vi .env_vars # put your SECRET keys here for twitter and telegram
cp twitter-keyword-bot.service /etc/systemd/system
systemctl start twitter-keyword-bot
```
to see the systemd logs
```
journalctl --follow -u twitter-keyword-bot
```

references
- http://www.sohamkamani.com/blog/2016/09/21/making-a-telegram-bot/
- http://techknights.org/workshops/nodejs-twitterbot/
- https://www.npmjs.com/package/twitter
- https://dev.twitter.com/streaming/overview
- https://certsimple.com/blog/deploy-node-on-linux
- https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha
