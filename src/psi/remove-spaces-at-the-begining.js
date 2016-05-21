var _ = require('lodash-node');
var tatoebaFile = 'newRes';
var LineByLineReader = require('line-by-line');
var lr = new LineByLineReader('./' + tatoebaFile);

lr.on('error', function(err) {
    console.log(err);
});

lr.on('line', function(line) {
    while(line[0] === ' ') {
        line = line.slice(1, line.length);
    }
    console.log(line);
});

lr.on('end', function() {

});
