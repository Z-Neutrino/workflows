var gulp = require('gulp'); // Node js command to bring in the gulp library and assign to gulp variable
var gutil = require('gulp-util');
/*
The task function allows you to create a new task
@param {string} = the name of your task
@param {function} = the task to be performed
*/
gulp.task('log', function() {
  gutil.log('Workflows are awesome');
});
