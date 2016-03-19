var _module = module; // jshint ignore:line

_module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});// jshint ignore:line

    grunt.initConfig({
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


    grunt.registerTask('travis', ['jshint']);

};
