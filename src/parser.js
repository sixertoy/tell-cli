/*jslint indent: 4, nomen: true, plusplus: true */
/*globals require, module, process */
(function () {

    'use strict';

    var parser,
        // lodash
        _ = require('lodash.template'),
        isempty = require('lodash.isempty'),
        isarray = require('lodash.isarray'),
        // requires
        path = require('path'),
        chalk = require('chalk'),
        fse = require('fs-extra'),
        yaml = require('js-yaml'),
        inquirer = require('inquirer'),
        esformatter = require('esformatter'),
        isvalidpath = require('is-valid-path'),
        // template
        header_template = '/*jshint unused: false */\n' +
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

    parser = function (args, options) {
        parser.args = args;
        parser.options = options;
    };

    /**
     *
     * Verifciation si le fichier
     * de spec existe dans le repertoire
     * de sortie
     *
     */
    parser.prototype.fileExists = function (file) {
        try {
            fse.statSync(file);
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     *
     * Creation d'un fichier de test
     *
     */
    parser.prototype.writeSpecFile = function (file, content, overwrite) {
        try {
            process.stderr.write(chalk.gray('writing: ' + file + '\n'));
            if (overwrite) {
                fse.removeSync(file);
            }
            fse.outputFileSync(file, content, {
                encoding: 'utf8'
            });
            process.stderr.write(chalk.bold.gray('info: ') + chalk.bold.gray('file has been written\n'));
        } catch (e) {
            throw e;
        }
    };


    /**
     *
     *
     *
     */
    parser.prototype.createQuestion = function (file, index) {
        file = path.relative(parser.options.cwd, file);
        return {
            default: false,
            type: 'confirm',
            name: 'overwrite_' + index,
            message: file + ' will be overwritten, continue ?'
        };
    };

    /**
     *
     *
     *
     */
    parser.prototype.parseItCases = function (cases) {
        var result = '',
            compiled = _('\nit(\'<%- description %>\', function(){});');
        cases.forEach(function (value) {
            result += compiled({
                description: value
            });
        });
        return result;
    };

    parser.prototype.parseStories = function (values) {
        var cases,
            result = '',
            compiled = _('\ndescribe(\'<%- label %>\', function(){<%= value %>});');
        Object.keys(values).forEach(function (label) {
            cases = values[label];
            if (isarray(cases)) {
                result += compiled({
                    label: label,
                    value: parser.parseItCases(cases)
                });
            } else {
                result += compiled({
                    label: label,
                    value: parser.parseStories(cases)
                });
            }
        });
        return result;
    };

    /**
     *
     * Parse le document yml
     * Pour créer les fichiers de tests
     *
     */
    parser.prototype.parseSpecs = function (spec) {
        var values, output_file, will_prompt, question, data, compiled,
            prompts = [],
            prompts_data = [],
            file_content = '',
            body_content = '',
            spec_files = Object.keys(spec),
            format_options = {
                indent: {
                    value: '    '
                },
                whiteSpace: {
                    before: {
                        FunctionName: 1,
                        FunctionReservedWord: 1,
                        FunctionDeclarationOpeningBrace: 1
                    }
                }
            };

        compiled = header_template + '<%= name %> = require(path.join(cwd, \'<%= file %>\'));' +
            '\ndescribe(\'<%- name %>\', function(){' +
            '\nbeforeEach(function(){});' +
            '\nafterEach(function(){});' +
            '<%= body %>' +
            '});' +
            '}());';
        compiled = _(compiled);

        spec_files.forEach(function (spec_file) {

            // check si le chemin de fichier est valide
            if (!isvalidpath(spec_file)) {
                return false;
            }
            //
            // nom du fichier de sortie
            output_file = path.join(parser.options.cwd, parser.options.folder, path.normalize(spec_file));
            output_file = output_file.replace(parser.options.extension, parser.options.spec_extension);
            //
            // check si le fichier existe
            will_prompt = parser.fileExists(output_file);
            //
            // recuperation des valeurs
            // des scenarios de test
            file_content = '';
            values = spec[spec_file];
            if (isempty(values)) {
                file_content = '';
            } else if (!values.length) {
                // is some DESCRIBE cases
                file_content += parser.parseStories(values);
            } else {
                // is an IT case
                file_content += parser.parseItCases(values);
            }
            //
            // templating du body
            body_content = esformatter.format(compiled({
                file: spec_file,
                body: file_content,
                name: path.basename(spec_file, path.extname(spec_file))
            }), format_options);
            //
            // si le fichier existe
            if (will_prompt && parser.args.yes) {
                parser.writeSpecFile(output_file, body_content);
                //
            } else if (will_prompt && !parser.args.yes) {
                question = parser.createQuestion(output_file, prompts.length);
                prompts_data.push({
                    file: output_file,
                    content: body_content
                });
                prompts.push(question);
            } else {
                parser.writeSpecFile(output_file, body_content);
            }
        });
        // si il y a des question
        // on envoi le prompt pour l'user
        if (prompts.length) {
            inquirer.prompt(prompts, function (answers) {
                Object.keys(answers)
                    .forEach(function (key, index) {
                        if (answers[key]) {
                            data = prompts_data[index];
                            parser.writeSpecFile(data.file, data.content);
                        }
                    });
            });
        } else {
            // sinon on arrete le process
            process.exit(0);
        }
    };


    module.exports = parser;

}());
