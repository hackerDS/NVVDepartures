module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      default: {
        options: {
          compess: true,
          cleancss: true
        },
        files: {
          'client/shared/css/bootstrap.css': 'client/shared/less/bootstrap.less'
        }
      }
    },
    watch: {
      default: {
        files: [
          'client/shared/less/**'
        ],
        tasks: ['less']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['less']);
  grunt.registerTask('release', ['less']);
};
