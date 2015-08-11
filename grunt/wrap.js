/*jslint indent: 4 */
/*global module, require */
module.exports = function (grunt) {
    'use strict';
    var path = require('path');
    return {
        options: {
            wrapper: function (filepath, option) {
                return ['#!/usr/bin/env node\n', ''];
            }
        },
        nodebin: {
            cwd: 'src/',
            expand: true,
            flatten: true,
            src: ['*.js'],
            dest: 'bin/'
        }
    };
};
