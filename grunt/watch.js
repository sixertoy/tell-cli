/*jslint indent: 4 */
/*global module */
module.exports = {
    options: {
        cwd: '.',
        livereload: false,
        livereloadOnError: false
    },
    wrap: {
        files: ['./src/**/*.js'],
        tasks: ['clean:nodebin', 'jshint:all', 'wrap:nodebin', 'rename:nodebin']
    }
};

