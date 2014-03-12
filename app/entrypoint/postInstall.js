var env = process.env.NODE_ENV;

if (env === 'heroku') {
    
    console.log('Install bower components after "npm intall"');

    var exec = require('child_process').exec;
    
    child = exec('../../node_modules/.bin/bower install', function(error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });

    return;
}

process.exit(1);