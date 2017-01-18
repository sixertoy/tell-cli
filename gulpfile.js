/* global require */
(function() {

    'use strict';

    var gulp = require('gulp'),
        bump = require('gulp-bump');

    gulp.task('bump', function() {
        gulp.src('./package.json')
            .pipe(bump())
            .pipe(gulp.dest('./'));
    });

    gulp.task('watch', ['default']);

}());
