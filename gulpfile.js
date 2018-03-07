var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    jsonminify = require('gulp-jsonminify'),
    concat = require('gulp-concat');

var env,
  coffeeSources,
  jsSources,
  sassSources,
  htmlSources,
  jsonSources,
  outputDir,
  sassConfigFile;


env = process.env.NODE_ENV || 'development';

if (env == 'development') {
  outputDir = 'builds/development/';
  sassConfigFile = 'expanded';
  console.log("Using development environment...");
} else {
  outputDir = 'builds/production/';
  sassConfigFile = 'compressed';
  console.log("Using production environment...");
}

coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];

// style includes all the files anyway so we don't need a bunch of files here
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];
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
    .pipe(gulpif(env === 'production', babel({
      presets: ['env']
    })))
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
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
      config_file: sassConfigFile + '-config.rb',
      sass: 'components/sass',
      image: outputDir + 'images'
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())
});


gulp.task('watch', function() {
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch('builds/development/*.html', ['html']);
  gulp.watch('builds/development/js/*.json', ['json']);
});

/**
* Use gulp-connect to fire up a server
* root: specifies where the files are located
*/
gulp.task('connect', function() {
  connect.server({
    root: outputDir,
    livereload: true
  });
});

/**
* Give it any files with html extension (see htmlSources)
* pipe them to the reloading algorithm
*/
gulp.task('html', function() {
  gulp.src('builds/development/*.html')
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    .pipe(connect.reload())
});

gulp.task('json', function() {
  gulp.src('builds/development/js/*.json')
    .pipe(gulpif(env === 'production', jsonminify()))
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
    .pipe(connect.reload());
});

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);
