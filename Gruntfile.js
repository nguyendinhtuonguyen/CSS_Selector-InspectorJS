var _module = module; // jshint ignore:line

_module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});// jshint ignore:line

    grunt.initConfig({
        clean: ['dist'],

        jshint: {
            files: ['gruntFile.js', 'src/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    grunt.option('verbose');
    grunt.registerTask('travis', ['jshint']);

};
