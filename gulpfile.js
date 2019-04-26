var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tsProject = ts.createProject('tsconfig.json');

gulp.task('default', function() {
	return gulp.src("src/**/*.ts")
		.pipe(sourcemaps.init())
		.pipe(tsProject())
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("./dist"));
});
