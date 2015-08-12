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
        tasks: ['build']
    }
};

