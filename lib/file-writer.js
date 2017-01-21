/* global require, module, process */
(function() {

    'use strict';

    var chalk = require('chalk'),
        fse = require('fs-extra'),
        ESFormatter = require('esformatter'),

        /**
         * [FileWriter description]
         * @type {Object}
         */
        FileWriter = {

            OPTIONS: {
                indent: {
                    value: '    '
                },
                whiteSpace: {
                    before: {
                        FunctionName: 1,
                        FunctionReservedWord: 1,
                        // eslint-disable-next-line
                        FunctionDeclarationOpeningBrace: 1
                    }
                }
            },

            /**
             * [writeFile description]
             * @param  {String} filepath
             * @param  {String} content
             * @param  {Boolean} overwrite
             */
            _writeFile: function(filepath, content, overwrite) {
                var msg = chalk.bold.gray('info: ') + chalk.bold.gray('file has been written\n');
                try {
                    process.stderr.write(chalk.gray('writing: ' + filepath + '\n'));
                    if (overwrite) {
                        fse.removeSync(filepath);
                    }
                    fse.outputFileSync(filepath, content, {
                        encoding: 'utf8'
                    });
                    process.stderr.write(msg);
                } catch (e) {
                    throw e;
                }
            },

            /**
             * [writeFiles description]
             * @param  {Object} obj
             */
            writeFiles: function(obj, overwrite) {
                var filepath = '',
                    filecontent = '',
                    filepaths = Object.keys(obj);
                while (filepaths.length) {
                    filepath = filepaths.shift();
                    filecontent = obj[filepath];
                    filecontent = ESFormatter.format(filecontent, FileWriter.OPTIONS);
                    filepath = filepath.replace('.js', '.spec.js');
                    FileWriter._writeFile(filepath, filecontent, overwrite);
                }

            }

        };

    module.exports = FileWriter;

}());
