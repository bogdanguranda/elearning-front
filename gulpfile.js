/**
 * Created by scorp on 4/2/2015.
 */
'use strict';
var gulp =require('gulp');

var sass = require('gulp-sass'),
    /*autoprefixer = require('gulp-autoprefixer'),*/
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    http = require('http'),
    st = require('st'),
    flatten = require('gulp-flatten'),
    fileinclude = require('gulp-file-include'),
    jade = require('gulp-jade');


gulp.task('styles', function() {
    return gulp.src([
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'bower_components/nouislider/distribute/nouislider.min.css',
            'bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
            'app/components/**/styles/*.scss',
            'app/components/**/*.scss',

            ])
        .pipe(sass({ style: 'expanded' }))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('public/assets/css'))
        .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('images', function(){
    return gulp.src('app/components/**/images/*.*')
        .pipe(flatten())
        .pipe(gulp.dest('public/assets/images/'))
        .pipe(notify({ message: 'Images moved' }));
});

gulp.task('fonts', function(){
    return gulp.src(['bower_components/bootstrap/fonts/*','app/fonts/*'])
        .pipe(flatten())
        .pipe(gulp.dest('public/assets/fonts/'))
        .pipe(notify({ message: 'Fonts moved' }));
});

gulp.task('index', function(){
    return gulp.src(['app/index.html'])
        .pipe( gulp.dest('public/'))
        .pipe(notify({message: "Index moved"}));
});

gulp.task('responses', function(){
    return gulp.src(['app/responses/*.*'])
        .pipe( gulp.dest('public/responses/'))
        .pipe(notify({message: "Responses moved"}));
});

// Clean
gulp.task('clean', function(cb) {
    del(['public/assets/css', 'public/assets/js', 'public/assets/images', 'public/plugins', 'public/*.html', 'public/responses'], cb);
});

gulp.task('scripts', function(){
    return gulp.src([
                        'bower_components/jquery/dist/jquery.min.js',
                        'bower_components/bootstrap/dist/js/bootstrap.min.js',
                        'bower_components/moment/min/moment.min.js',
                        'bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
                        'bower_components/nouislider/distribute/nouislider.min.js', 
                        'bower_components/Chart.js/Chart.min.js', 
                        'app/_include/scripts/raphael-min.js', 
                        'bower_components/typeahead.js/dist/typeahead.jquery.js',
                        'bower_components/jquery.pep/src/jquery.pep.js',
                        'app/components/**/*.js', 
                    ])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('public/assets/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('public/assets/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('compile_templates', function() {
  gulp.src('app/pages/*.jade')
    .pipe(jade({
        pretty: ' '
    }))
    .pipe(gulp.dest('public/'));
});

gulp.task('default',['clean'], function(){
    gulp.start('styles',  'watch', 'server', 'scripts', 'images', 'fonts', 'index', 'compile_templates', 'responses');
});

// Watch
gulp.task('watch', function() {

// Watch .scss files
    gulp.watch('app/components/**/*.scss', ['styles', 'compile_templates']);
    gulp.watch('app/components/**/*.js', ['scripts', 'compile_templates']);
    gulp.watch('app/dependencies/*.js',['scripts']);
    gulp.watch(['app/_include/scss/*.scss','app/styles/*.scss'],['styles']);
    gulp.watch('app/components/**/*.jade',['styles', 'scripts', 'compile_templates']);
    gulp.watch('app/pages/*.jade',['compile_templates']);
    gulp.watch('app/responses/*',['responses']);
    gulp.watch('app/index.html', ['index']);

// Create LiveReload server
    livereload.listen();

// Watch any files in public/, reload on change
    gulp.watch(['public/**']).on('change', livereload.changed);

});

gulp.task('server', function(done) {
    http.createServer(
        st({ path: 'public', index: 'index.html', cache: false })
    ).listen(8088, done);
});