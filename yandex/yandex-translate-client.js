var translate = require('yandex-translate');
var js = require('jsonfile');
var util = require('util');

var getTranslation = function(textToTranslate, callback) {

	translate(textToTranslate, {
		from: 'pl',
		to: 'ru',
		key: 'trnsl.1.1.20150114T220515Z.631c19790aa1feca.597002495cf728a0fb30e3df1eaae6fe338d4a08'
	}, function(err, res) {
		if (res.code === 200) {
			callback(res.text);
		}
	});
};

var translation = getTranslation('Yandex-translate przetłumaczył to na rosyjski!', function (translation) {
	console.log(translation);
});

