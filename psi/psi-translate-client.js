var _ = require('lodash-node');
var exec = require('child_process').exec;

var tatoebaFile = 'tatoeba.pl';
var LineByLineReader = require('line-by-line');
var lr = new LineByLineReader('./../reference-translation/tatoeba/' + tatoebaFile);


function execute(command, callback) {
    exec(command, function(error, stdout, stderr) {
        callback(stdout);
    });
};


var getTranslation = function(textToTranslate, callback) {
    execute('echo "' + textToTranslate.toLowerCase() + '" | psi-pipe translate-plru', function(data) {
        callback(data);
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
                russian[i] = translation;
                translationComplete();
                return translation;
            });
        })(i);
    });
});
