require("dotenv").config();

var request = require("request");

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var myKeys = require("./keys");

var twitclient = new Twitter(myKeys.twitter);
var spotifyclient = new Spotify(myKeys.spotify);


function output (message) {
    console.log(message);
    fs.appendFileSync("log.txt", message);
}

///////////////////////////////////////////////////////////////////////////////

function do_my_tweets(arg) {
    var params = {
        screen_name: 'BcstuffF',
        count: 20,
    };

    twitclient.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (let tweet of tweets) {
                output("\nPosted on: " + tweet.created_at);
                output("\nPost: " + tweet.text);
                output('\n******************************************************\n');
            }
        } else {
            output("Error listing my tweets: " + error);
        }
    });
};

///////////////////////////////////////////////////////////////////////////////

function do_spotify_this_song(title) {
    var query = { type: "track", query: title };
    if (!title) {
        query.query = "track:sign artist:base"
    }
    spotifyclient.search(query, function (err, data) {
        if (err) {
            output("\nError searching for song '" + title + "': " + err);
        } else {
            var song = data.tracks.items[0];

            for (j = 0; j < song.artists.length; j++) {
                output("\nArtist(s): " + song.artists[j].name);
            }
            output("\nSong Title: " + song.name);

            output("\nPreview URL: " + song.preview_url);

            output("\nAlbum: " + song.album.name + "\n");
        }
    });
}

///////////////////////////////////////////////////////////////////////////////

function do_movie_this(movie) {

    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {
            var movieData = JSON.parse(body);

            if (movieData.Response === 'False') {
                output("Error searching for movie '" + movie + "': " + movieData.Error);
            } else {

                output("\nTitle: " + movieData.Title)
                output("\nRelease Year: " + movieData.Year);

                for (let rating of movieData.Ratings) {
                    output("\n" + rating.Source + " Rating: " + rating.Value);
                }

                output("\nCountry: " + movieData.Country);
                output("\nLanguage: " + movieData.Language);
                output("\nPlot: " + movieData.Plot);
                output("\nActors: " + movieData.Actors + "\n");
            }
        }
    });

}

///////////////////////////////////////////////////////////////////////////////

function do_what_it_says(arg) {
    fs.readFile("random.txt", "utf8", function (error, data) {
        var splitLine = data.trim().split(",");
        splitLine[1] = splitLine[1].split('"').join('');
        executeThings(splitLine[0], splitLine[1]);
    });
}

///////////////////////////////////////////////////////////////////////////////

function executeThings(cmd, arg) {
    switch (cmd) {
        case 'my-tweets':
            do_my_tweets(arg);
            break;
        case 'spotify-this-song':
            do_spotify_this_song(arg);
            break;
        case 'movie-this':
            do_movie_this(arg);
            break;
        case 'do-what-it-says':
            do_what_it_says(arg);
            break;
        default:
        output("I don't know how to '" + cmd + "'");
    }
}

///////////////////////////////////////////////////////////////////////////////

function main(argv) {
    executeThings(argv[2], argv[3]);
}

main(process.argv);
