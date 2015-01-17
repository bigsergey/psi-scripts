var translate = require('yandex-translate');
var _ = require('lodash-node');

var tatoebaFile = 'tatoeba.pl';
var LineByLineReader = require('line-by-line');
var lr = new LineByLineReader('/home/sergey/Projects/psi-scripts/reference-translation/tatoeba/' + tatoebaFile);


var getTranslation = function(textToTranslate, callback) {

    translate(textToTranslate, {
        from: 'pl',
        to: 'ru',
        key: 'trnsl.1.1.20150114T220515Z.631c19790aa1feca.597002495cf728a0fb30e3df1eaae6fe338d4a08'
    }, function(err, res) {
        if (res.code === 200) {
            callback(res.text);
        } else {
            console.log('Error', err);
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
            getTranslation(line, function(translation) {
                russian[i] = translation[0];
                translationComplete();
                return translation[0];
            });
        })(i);
    });
});
