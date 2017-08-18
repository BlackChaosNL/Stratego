var gulp = require('gulp'),
	live = require('gulp-livereload'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	html = require('gulp-htmlmin'),
	img = require('gulp-imagemin'),
	del = require('del');

gulp.task('js', function () {
	return gulp.src(['./app/js/**/*.js', './app/includes/*.js'])
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./rhel/js'));
});

gulp.task('scss', function () {
	return gulp.src('./app/css/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('rhel/css'));
});

gulp.task('html', function () {
	return gulp.src('./app/html/**/*.html')
		.pipe(html({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('./rhel/html/'));
});

gulp.task('imaging', function () {
	return gulp.src('./app/img/**/*')
		.pipe(img())
		.pipe(gulp.dest('./rhel/img'));
});

gulp.task('refresh', function () {
	return del(['./rhel/*']);
});

gulp.task('default', ['js', 'scss', 'html', 'imaging'], function () {
	live.listen();
	gulp.watch('./app/css/*.scss', ['scss']);
	gulp.watch('./app/js/**/*.js', ['js']);
	gulp.watch('./app/html/**/*.html', ['html']);
	gulp.watch('./app/img/**/*', ['imaging']);
});