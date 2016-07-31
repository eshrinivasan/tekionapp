// before running, do:
//  npm install gulp -g
//  npm install gulp --save

var gulp = require('gulp');

// define a task named hello that prints 'hello' to the console
gulp.task('hello', function() {
    console.log('hello');
});

// chain that task with another to do 2 tasks
gulp.task('question', ['hello'], function() {
    console.log('Are you there?');
});

// from the command line:
// gulp question

/*
    Concatenate all files in public/js/app folder into one js file, and minify it, saving the result
    in a new assets folder, which the app will use (need to change code accordingly)

    from the command line:
    npm install gulp-concat --save
    npm install gulp-uglify --save
*/

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
gulp.task('concatmin', function() {
    gulp
        .src('public/javascripts/**/*.js')
        .pipe(concat('share.js'))
        .pipe(gulp.dest('public'))
});


