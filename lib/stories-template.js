/* global require, module */
(function() {

    'use strict';

    var Path = require('path'),
        ucfirst = require('ucfirst'),
        // lib
        template = require('lodash.template'),

        /**
         * [StoriesTemplate description]
         * @type {Object}
         */
        StoriesTemplate = {

            HEADER: false,

            /**
             * [_getRequireValue description]
             * @param  {String} filepath
             * @return {String}
             */
            _getRequireValue: function(filepath) {
                if (filepath.indexOf('.js') < 0) {
                    return filepath;
                }
                return filepath.replace('.js', '');
            },

            /**
             * [_getSuiteName description]
             * @param  {String} require
             * @return {String}
             */
            _getSuiteName: function(require) {
                var extname = Path.extname(require),
                    name = Path.basename(require, extname);
                if (name.indexOf('-') < 0) {
                    return name;
                }
                return name.split('-').map(function(value) {
                    return ucfirst(value);
                }).join('');
            },

            /**
             * [_getHeader description]
             * @return {String}
             * @protected
             */
            _getHeaderTemplate: function() {
                var header = '';
                if (!StoriesTemplate.HEADER) {
                    header += '/* eslint no-console: 0, no-undefined: 0, max-statements: 0 */\n';
                    header += '/* global __dirname, process, require, ';
                    header += 'describe, it, beforeEach, afterEach */\n';
                    header += '(function(){\n\n\t\'use strict\';';
                    header += '\n\n\tvar sinon = require(\'sinon\'),';
                    header += '\nexpect = require(\'chai\').expect,\n// library\n';
                    StoriesTemplate.HEADER = header;
                }
                return StoriesTemplate.HEADER;
            },

            /**
             * [_getHeaderTemplate description]
             * @return {[type]} [description]
             */
            _getBodyTemplate: function() {
                var body = '<%= name %> = require(\'<%= require %>\');\n';
                body += '\ndescribe(\'<%- name %>\', function(){\n';
                body += '\nbeforeEach(function(){});\nafterEach(function(){});\n';
                body += '<%= suites %>\n\n});\n\n}());\n';
                return body;
            },

            /**
             * [getCase description]
             * @param  {String} description
             * @return {String}
             */
            getCase: function(description) {
                var compiled = template('\nit(\'<%- description %>\', function(){});');
                return compiled({
                    description: description
                });
            },

            /**
             * [getFunction description]
             * @param  {String} label
             * @param  {Array} cases
             * @return {String}
             */
            getDescribe: function(label, cases) {
                var compiled = template('\ndescribe(\'<%- label %>\', function(){<%= value %>});');
                return compiled({
                    label: label,
                    value: cases
                });
            },

            /**
             * [getSuite description]
             * @param  {String} filepath
             * @param  {Array} suites
             * @return {String}
             */
            getSuite: function(filepath, suites) {
                var compiled = null,
                    require = StoriesTemplate._getRequireValue(filepath),
                    name = StoriesTemplate._getSuiteName(require),
                    filetemplate = StoriesTemplate._getHeaderTemplate();
                filetemplate += StoriesTemplate._getBodyTemplate();
                compiled = template(filetemplate);
                return compiled({
                    name: name,
                    suites: suites,
                    require: require
                });
            }

        };

    module.exports = StoriesTemplate;

}());
