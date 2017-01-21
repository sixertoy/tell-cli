/* global process, require, console */
(function() {

    'use strict';

    var msg = null,
        ymlfile = null,
        content = null,
        stories = null,
        templates = null,
        // npm
        chalk = require('chalk'),
        yaml = require('js-yaml'),
        fse = require('fs-extra'),
        commander = require('commander'),
        // lib
        FileWriter = require('./lib/file-writer'),
        StoriesParser = require('./lib/stories-parser');

    // traitement des params args du cli
    commander.version('0.1.1')
        .usage('[options] path/to/stories/file.yml')
        .option('-Y, --yes', 'Force files overwrite')
        .option('-E, --esprima', 'Force files overwrite')
        .option('-S, --show', 'Output stories in console')
        .parse(process.argv);

    /* -----------------------------------------------------------------------------
     *
     * parse les arguments du cli
     *
     ----------------------------------------------------------------------------- */

    if (!commander.args.length) {
        // check a file is define in the command line argument
        process.stderr.write(chalk.bold.red('Error: ') + chalk.bold('missing arguments\n'));
        // @TODO output help usage
        process.exit(1);
    }

    ymlfile = commander.args[0];

    try {

        if (commander.esprima) {
            stories = './lib/file-writer.js';
            StoriesParser.objectify(stories);
            return false;
        }

        // load yml file if exists else => error
        content = fse.readFileSync(ymlfile, 'utf8');
        stories = yaml.load(content);
        if (!stories) {
            msg = 'no stories found in file: ' + ymlfile;
            process.stderr.write(chalk.bold.red('Error: ') + chalk.bold(msg) + '\n');
            process.exit(1);

        } else if (commander.show) {
            // if `generate` argument is used in the command line
            // will output yamlfile's content to console
            // return outputInConsole(ymlfile);
            // @TODO output yaml file content to console
        }
        templates = StoriesParser.parse(stories);
        FileWriter.writeFiles(templates);

    } catch (e) {
        // erreur lors du process
        process.stderr.write(chalk.bold.red('Error: ') + chalk.bold(e.message) + '\n');
        console.log(e.stack);
        process.exit(1);
    }

}());
