var env = process.env.NODE_ENV;

console.log('post install script for environment "' + env + '"');

if (env === 'heroku' || env == 'azure' || env === 'production') {
    
    console.log('Install bower components after "npm intall"');

    var exec = require('child_process').exec;

    var command = env != 'heroku'
        ? 'node_modules\.bin\bower install'
        : './node_modules/.bin/bower install';

    child = exec(command, function(error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });

    return;
}