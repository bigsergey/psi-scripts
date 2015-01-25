var request = require('request');
var _ = require('lodash-node');
var querystring = require('querystring');
var tatoebaFile = 'kde.pl';
var LineByLineReader = require('line-by-line');
var lr = new LineByLineReader('/home/sergey/Projects/psi-scripts/reference-translation/kde/' + tatoebaFile);

var fs = require("fs");

var prepareUrl = function(text) {
    return 'http://translatica.pl//translate.php?direction=plru&source=' + encodeURI(text).replace(/%20/g, '+');
};

var getTranslation = function(url, callback) {
    request({
        'url': url,
        'content-type': 'application/json; charset=utf-8'
    }, function(error, response, body) {
        if (!error) {
            callback(JSON.parse(body));
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
