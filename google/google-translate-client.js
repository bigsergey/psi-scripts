var request = require('request');
var _ = require('lodash-node');
var querystring = require('querystring');

var tatoebaFile = 'kde.pl';
var LineByLineReader = require('line-by-line');
var lr = new LineByLineReader('/home/sergey/Projects/psi-scripts/reference-translation/kde/' + tatoebaFile);


var prepareUrl = function(text) {
    var opts = {
        client: 'gtx',
        sl: 'pl', //source language
        tl: 'ru', //target language
        dt: 't', //response data format
        ie: 'UTF-8',
        oe: 'UTF-8',
        q: text
    };

    return 'http://translate.googleapis.com/translate_a/single?' + querystring.stringify(opts);
};

var getTranslation = function(url, callback) {
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {

            //remove .."pl" on the end
            body = body.substring(0, body.length - 7) + "]";
            body = JSON.parse(body);

            var translation = '';
            _.forEach(body[0], function(arr) {
                translation += arr[0];
            });

            callback(translation);
        }
    });
};

var index = 0;
var polish = [];
var russian = [];

lr.on('error', function(err) {
    console.log(err);
});


lr.on('line', function(line) {
    polish[index] = line;
    index++;
});

lr.on('end', function() {

    var translationComplete = _.after(polish.length, function() {
        _.forEach(russian, function(line) {
            console.log(line);
        });

    });

    _.forEach(polish, function(line, i) {
        (function(i) {
            getTranslation(prepareUrl(line), function(translation) {
                russian[i] = translation;
                translationComplete();
                return translation;
            });
        })(i);
    });
});