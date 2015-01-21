var request = require('request');
var _ = require('lodash-node');
var querystring = require('querystring');

var tatoebaFile = 'kde.pl';
var LineByLineReader = require('line-by-line');
var lr = new LineByLineReader('/home/sergey/Projects/psi-scripts/reference-translation/kde/' + tatoebaFile);

var fs = require("fs");

var prepareUrl = function(text) {
    return 'http://api.microsofttranslator.com/v2/ajax.svc/TranslateArray?appId=%22Tu8Vo8qatiLrfj6txzCOPYtWLJMwNnbd0iB0oknLdAXs*%22&texts=[%22+' + encodeURI(text).replace(/%20/g, '+') + '+%22]&from=%22pl%22&to=%22ru%22';
};

var getTranslation = function(url, callback) {
    request(url, function(error, response, body) {
        if (!error) {

            var translation = body.slice(body.indexOf('TranslatedText') + ('TranslatedText": " ').length - 1, body.indexOf('TranslatedTextSentenceLengths') - 4);

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
