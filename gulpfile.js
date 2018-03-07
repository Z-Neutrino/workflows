var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat');


var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];

// style includes all the files anyway so we don't need a bunch of files here
var sassSources = ['components/sass/style.scss'];
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

/*
  Task to combine js files into one file
*/
gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest('builds/development/js'))
    .pipe(connect.reload())
});

/*
  Compiles Sass to CSS
  In the compass call we pass in an object which specifies our Sass preferences
  sass parameter is where the Sass files are coming from
  image parameter is where it should look for the images
  style is the output style
  See here for output styles: http://sass-lang.com/documentation/file.SASS_REFERENCE.html#output_style
*/
gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      image: 'builds/development/images',
      style: 'expanded'
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest('builds/development/css'))
    .pipe(connect.reload())
});


gulp.task('watch', function() {
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
});

/**
* Use gulp-connect to fire up a server
* root: specifies where the files are located
*/
gulp.task('connect', function() {
  connect.server({
    root: 'builds/development/',
    livereload: true
  });
});

gulp.task('default', ['coffee', 'js', 'compass', 'connect', 'watch']);
