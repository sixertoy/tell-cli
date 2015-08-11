/*jslint indent: 4, nomen: true */
/*globals process, require, console */
(function () {

    'use strict';

    var document,
        semver = '0.1.1',
        fs = require('fs'),
        path = require('path'),
        yaml = require('js-yaml'),
        args = process.argv.slice(2);

    function exec(folder) {
        try {
            var p = path.join(folder, 'description.yml'),
                content = fs.readFileSync(p, 'utf8');
            document = yaml.safeLoad(content);
            console.log(document);
        } catch (e) {
            process.stderr.write(':q! no desciption file found in ' + folder);
            process.stderr.write(e.message + '\n');
            process.exit(1);
        }
    }

    if (args.length < 1) {
        if (!args.length || args[0] === '--help' || args[0] === '-h' || args[1] !== '--version' || args[1] !== '-v') {
            //
            // Usage
            process.stdout.write('Usage: udescribe [spec_folder]\n');
            process.stdout.write('       udescribe path/to/spec\n');
            process.stdout.write('\n');
            //
            // Options
            process.stdout.write('Options:\n');
            process.stdout.write('  -v, --version\t\tprint script version\n');
            process.stdout.write('\n');
            //
            // Filetypes
            process.exit(0);
        } else if (args[1] === '--version' || args[1] === '-v') {
            process.stdout.write('v' + semver + '\n');
            process.exit(0);
        } else {
            process.exit(0);
        }
    } else {
        if (args.length < 2) {
            process.stderr.write(':q! missing arguments\n');
            process.exit(1);
            // error
        } else {
            exec(args[0]);
        }
    }

    process.on('SIGINT', function () {
        process.stderr.write(':q! aborted by user');
        process.exit(1);
    });

}());
