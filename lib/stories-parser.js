/* global require, module */
(function() {

    'use strict';

    var fse = require('fs-extra'),
        Esprima = require('esprima'),
        // lib
        StoriesTemplate = require('./stories-template'),

        /**
         * [StoriesParser description]
         * @type {Object}
         */
        StoriesParser = {

            /**
             * [_parseCases description]
             * @param  {Array} array
             * @return {Array}
             */
            _parseCases: function(array) {
                var its = [],
                    cas = null,
                    cases = [].concat(array);
                while (cases.length) {
                    cas = cases.shift();
                    cas = StoriesTemplate.getCase(cas);
                    its.push(cas);
                }
                return its;
            },

            /**
             * [_parseFunctions description]
             * @param  {Object} obj
             * @return {Array}
             */
            _parseFunctions: function(obj) {
                var its = null,
                    cases = [],
                    describes = [],
                    describe = null,
                    funcname = null,
                    functions = Object.keys(obj);
                while (functions.length) {
                    funcname = functions.shift();
                    cases = obj[funcname];
                    its = StoriesParser._parseCases(cases);
                    describe = StoriesTemplate.getDescribe(funcname, its);
                    describes.push(describe);
                }
                return describes;
            },

            /**
             * [parse description]
             * @param  {Object} stories
             * @return {Object}
             */
            parse: function(stories) {
                var suites = null,
                    templates = {},
                    filepath = null,
                    describes = null,
                    files = Object.keys(stories);
                while (files.length) {
                    filepath = files.shift();
                    describes = stories[filepath];
                    suites = StoriesParser._parseFunctions(describes);
                    suites = StoriesTemplate.getSuite(filepath, suites);
                    templates[filepath] = suites;
                }
                return templates;
            },

            objectify: function(file) {
                var content = null,
                    program = fse.readFileSync(file, 'utf8');
                content = Esprima.parse(program, {
                    loc: true
                });
                console.log('content', content.body);
            }

        };

    module.exports = StoriesParser;

}());
