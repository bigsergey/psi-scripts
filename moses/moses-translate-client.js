var _ = require('lodash-node');
var tatoebaFile = 'tatoeba.pl.tok';
var LineByLineReader = require('line-by-line');
var lr = new LineByLineReader('/home/sergey/Projects/psi-scripts/reference-translation/tatoeba/' + tatoebaFile);
var exec = require('exec-queue');

var host = '127.0.0.1';
var port = 8080;

function execute(command, callback) {
    exec(command, function(error, stdout, stderr) {
        callback(stdout);
        if (error) {
            console.log(error);
        }
    });
};


var getTranslation = function(line, callback) {
    execute('echo "' + line.toLowerCase() + '" | nc ' + host + ' ' + port, function(data) {
        callback(data);
    });
};

lr.on('error', function(err) {
    console.log(err);
});


lr.on('line', function(line) {
    lr.pause();
    getTranslation(line, function(translation) {
        console.log(translation.slice(0, translation.length - 1));
        lr.resume();
    });

});

lr.on('end', function() {

});
