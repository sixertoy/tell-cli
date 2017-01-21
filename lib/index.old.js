/* global process, require, console */
(function() {

    'use strict';

    // fichier de description des scenarios
    var descriptionFile = null,
        defaults = {
            // nombre de documents a traiter
            files: [],
            extension: '.js',
            input_folder: '',
            cwd: process.cwd(),
            spec_extension: '.spec.js'
        },
        // lodash
        isempty = require('lodash.isempty'),
        isarray = require('lodash.isarray'),
        template = require('lodash.template'),
        // requires
        path = require('path'),
        chalk = require('chalk'),
        fse = require('fs-extra'),
        yaml = require('js-yaml'),
        inquirer = require('inquirer'),
        commander = require('commander'),
        esformatter = require('esformatter'),
        isvalidpath = require('is-valid-path'),
        // template
        headerTemplate = '/*jshint unused: false */\n' +
        '/*jslint indent: 4, nomen: true */\n' +
        '/*global __dirname, jasmine, process, require, define, describe, xdescribe, it, xit, expect, beforeEach, afterEach, afterLast, console */\n' +
        '(function(){\n' +
        '\t\'use strict\';\n' +
        '\tvar //variables\n' +
        'cwd = process.cwd(),\n' +
        '// requires\n' +
        'path = require(\'path\'),\n' +
        'sinon = require(\'sinon\'),\n' +
        'expect = require(\'chai\').expect,\n';

    // traitement des params args du cli
    commander
        .version('0.1.1')
        .usage('[options] <spec_folder ...>')
        .option('-Y, --yes', 'Force files overwrite')
        .option('-g, --generate', 'Generate spec files')
        .parse(process.argv);

    /**
     *
     * Par defaut
     * Au lance du cli sans options
     * Affichage dans la console
     * du fichier YAML
     *
     */
    function outputInConsole (file) {
        var rstream = null;
        try {
            process.stdout.write(chalk.bold.green('describing: ') + chalk.bold(file + '\n'));
            rstream = fse.createReadStream(file, {
                encoding: 'utf8'
            });
            rstream
                .on('error', function(err) {
                    throw err;
                })
                .on('data', function(data) {
                    process.stdout.write(data);
                }).on('end', function() {
                    process.exit(0);
                });
        } catch (e) {
            throw e;
        }
    }

    /**
     *
     * Verifciation si le fichier
     * de spec existe dans le repertoire
     * de sortie
     *
     */
    function fileExists (file) {
        try {
            fse.statSync(file);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     *
     *
     *
     */
    function createQuestion (pfile, index) {
        var file = path.relative(defaults.cwd, pfile);
        return {
            default: false,
            type: 'confirm',
            name: 'overwrite_' + index,
            message: file + ' will be overwritten, continue ?'
        };
    }

    /**
     *
     * Parse le document yml
     * Pour créer les fichiers de tests
     *
     */
    function parseSpecs (spec) {
        var values = null,
            outputFile = null,
            willPrompt = null,
            question = null,
            data = null,
            compiled = null,
            prompts = [],
            promptsData = [],
            fileContent = '',
            bodyContent = '',
            specFiles = Object.keys(spec),
            formatOptions = ;

        compiled = headerTemplate + '<%= name %> = require(path.join(cwd, \'<%= file %>\'));' +
            '\ndescribe(\'<%- name %>\', function(){' +
            '\nbeforeEach(function(){});' +
            '\nafterEach(function(){});' +
            '<%= body %>' +
            '});' +
            '}());';
        compiled = template(compiled);

        specFiles.forEach(function(specFile) {

            // check si le chemin de fichier est valide
            if (!isvalidpath(specFile)) {
                return false;
            }
            //
            // nom du fichier de sortie
            outputFile = path.join(defaults.cwd, defaults.folder, path.normalize(specFile));
            outputFile = outputFile.replace(defaults.extension, defaults.spec_extension);
            //
            // check si le fichier existe
            willPrompt = fileExists(outputFile);
            //
            // recuperation des valeurs
            // des scenarios de test
            fileContent = '';
            values = spec[specFile];
            if (isempty(values)) {
                fileContent = '';
            } else if (!values.length) {
                // is some DESCRIBE cases
                fileContent += parseStories(values);
            } else {
                // is an IT case
                fileContent += parseItCases(values);
            }
            //
            // templating du body
            bodyContent = esformatter.format(compiled({
                file: specFile,
                body: fileContent,
                name: path.basename(specFile, path.extname(specFile))
            }), formatOptions);
            //
            // si le fichier existe
            if (willPrompt && commander.yes) {
                writeSpecFile(outputFile, bodyContent);
                //
            } else if (willPrompt && !commander.yes) {
                question = createQuestion(outputFile, prompts.length);
                promptsData.push({
                    file: outputFile,
                    content: bodyContent
                });
                prompts.push(question);
            } else {
                writeSpecFile(outputFile, bodyContent);
            }
        });
        // si il y a des question
        // on envoi le prompt pour l'user
        if (prompts.length) {
            inquirer.prompt(prompts, function(answers) {
                Object.keys(answers)
                    .forEach(function(key, index) {
                        if (answers[key]) {
                            data = promptsData[index];
                            writeSpecFile(data.file, data.content);
                        }
                    });
            });
        } else {
            // sinon on arrete le process
            process.exit(0);
        }
    }

}());
