var request = require('request');
var _ = require('lodash-node');
var querystring = require('querystring');

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

var text = 'Google Translate przetłumaczył to na rosyjski!';

getTranslation(prepareUrl(text), function(translation) {
	console.log(translation);
});
