require("dotenv").config();

var myKeys = require("keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


//Make it so liri.js can take in one of the following commands:
//* `my-tweets`

//* `spotify-this-song`

//* `movie-this`

//* `do-what-it-says`

var params = {screen_name: 'bcstuff_forclass'};

client.get('statuses/user_timeline', params, function(error, tweets, response){
  if (!error) {
    console.log(tweets);
  }
});