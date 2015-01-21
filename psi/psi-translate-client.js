var exec = require('child_process').exec;

function execute(command, callback) {
    exec(command, function(error, stdout, stderr) {
        callback(stdout);
    });
};

var str = "Tłumacz polsko-rosyjski";

execute('echo "' + str.toLowerCase() + '" | psi-pipe translate-plru', function(data) {
    console.log(data);
});
