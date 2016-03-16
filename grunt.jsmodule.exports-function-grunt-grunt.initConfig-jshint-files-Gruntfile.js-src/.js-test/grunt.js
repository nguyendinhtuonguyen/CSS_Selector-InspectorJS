module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['grunt.js', 'source/**/*.js'],
      options: {
        globals: {
          jQuery: false
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint']);

};
