var request = require('request');
var _ = require('lodash-node');
var querystring = require('querystring');

var prepareUrl = function(text) {
	var opts = {
		client: 'gtx',
		sl: 'pl', //source language
		tl: 'ru', //target language
		dt: 't',
		q: text
	};
	return 'https://translate.googleapis.com/translate_a/single?' + querystring.stringify(opts);
};

var getTranslation = function(url, callback) {
	console.log(url);
	request(url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			body = JSON.parse(body);

			var translation = '';
			_.forEach(body[0], function(arr) {
				translation += arr[0];
			});

			callback(translation);
		}
	});
};

var text = 'Witam! Przetłumacz to! Tak';

getTranslation(prepareUrl(text), function(translation) {
	console.log(translation);
});
