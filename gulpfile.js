var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee');


var coffeeSources = ['components/coffee/tagline.coffee'];
/*
  Notes:
  - When doing a gulp pipe you need to specify the original file location
  using the src method. This can be an array of files or a single file
  - Then pipe it using the pipe method. Here we pass the coffee variable
  through to specify the coffee module. We set an option as bare (see coffee
  usage docs). Bare put a safety wrapper function around the JS.
  It sends the output of the first plugin (coffee) to the input of the next
  which is just the destination location - dest()
*/
gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});
