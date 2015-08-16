/*globals module, require */
/*jslint indent: 4 */
(function () {

    'use strict';

    var // variables
        src = './src',
        dist = './bin',
        // requires
        gulp = require('gulp'),
        path = require('path'),
        wrap = require('gulp-wrap'),
        bump = require('gulp-bump'),
        rename = require('gulp-rename'),
        jshint = require('gulp-jshint');

    gulp.task('bump', function () {
        gulp.src('./package.json')
            .pipe(bump())
            .pipe(gulp.dest('./'));
    });

    gulp.task('build', function () {
        gulp.src(path.join(src, 'cli.js'))
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(wrap('#!/usr/bin/env node\n\n<%= contents %>'))
            .pipe(rename('cli'))
            .pipe(gulp.dest(dist));
    });

    gulp.task('default', function () {
        gulp.watch(path.join(src, 'cli.js'), ['build']);
    });

    gulp.task('watch', ['default']);

}());
