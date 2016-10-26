var gulp = require('gulp'),
    usemin = require('gulp-usemin'),
    watch = require('gulp-watch'),
    minifyCss = require('gulp-cssnano'),
    minifyJs = require('gulp-uglify'),
    concat = require('gulp-concat'),
	runSequence = require('run-sequence');
	clean = require('gulp-clean');
	rename = require('gulp-rename'),
	RevAll = require('gulp-rev-all'),
	replace = require('gulp-replace'),
	gulpif = require('gulp-if'),
	gulpUtil = require('gulp-util'),
    argv = require('yargs').argv;


var paths = {
	allscripts: 'src/js/**/*.*',
	scripts: 'src/js/core/**/*.*',
	styles: 'src/css/**/*.*',
	images: 'src/img/**/*.*',
	index: 'src/index.html',
	manifest : 'src/manifest.json',
	locales : 'src/_locales/**/*.*',
	bower_fonts: 'src/bower_components/**/*.{ttf,woff,eof,svg}',
};


function runAllTasks(cb) {
	runSequence('pretasks','posttask', 'watch',  cb);
}


// function buildProject(cb) {
// 	runSequence('pretasks' ,'posttask', 'cleanup', cb);
// }

/**
 * Copy assets
 */
gulp.task('build-assets', ['copy-bower_fonts']);

gulp.task('copy-bower_fonts', function () {
	return gulp.src(paths.bower_fonts)
        .pipe(rename({
        	dirname: '/fonts'
        }))
        .pipe(gulp.dest('dist/lib'));
});

/**
 * Handle custom files
 */
gulp.task('build-custom', ['custom-images', 'custom-js','copy-manifest', 'copy-locales']);

gulp.task('copy-manifest', function () {
	return gulp.src(paths.manifest)
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy-locales', function () {
	return gulp.src(paths.locales)
        .pipe(gulp.dest('dist/_locales'));
});


gulp.task('custom-images', function () {
	return gulp.src(paths.images)
        .pipe(gulp.dest('dist/img'));
});

gulp.task('custom-js', function () {
		// return gulp.src('src/js/background.js')
		// 	// .pipe(gulpif(argv.production, replace('http://localhost:3000', 'https://plugin.addoo.io')))
		// 	// .pipe(gulpif(argv.production, replace('http://localhost:3001', 'https://node.addoo.io')))
		// 	.pipe(minifyJs())
		// 	.pipe(concat('background.js'))
		// 	.pipe(gulp.dest('dist/js'));
		return gulp.src(paths.scripts)
        .pipe(gulp.dest('dist/js'));

	// }
});

gulp.task('custom-css', function () {
	return gulp.src(paths.styles)
        .pipe(gulp.dest('dist/css'))
});


/**
 * Watch custom files
 */
gulp.task('watch', function () {
	gulp.watch([paths.images], ['custom-images']);
	gulp.watch([paths.styles], ['usemin']);
	gulp.watch([paths.allscripts], ['usemin']);
	gulp.watch([paths.index], ['usemin']);
});

// /**
//  * Live reload server
//  */
// gulp.task('webserver', function () {
// 	connect.server({
// 		root: 'dist',
// 		livereload: false,
// 		port: process.env.PORT || 3000
// 	});
// });


/**
 * Handle bower components from index
 */
gulp.task('usemin', function () {
	return gulp.src(paths.index)
        .pipe(usemin({
        	js1: [minifyJs(), 'concat'],
        	js2: [minifyJs(), 'concat'],
        	css1: [minifyCss({ keepSpecialComments: 0 }), 'concat'],
        	css2: [minifyCss({ keepSpecialComments: 0 }), 'concat'],
        }))
        // .pipe(minifyJs().on('error', console.log)) // notice the error event here
        .pipe(gulp.dest('dist/'));
});

gulp.task('clean' , function () {
  return gulp.src(['temp'], {read: false})
    .pipe(clean());
});


/**
 * Gulp tasks
 */
gulp.task('pretasks', ['build-assets', 'build-custom']);
// gulp.task('startserver', ['webserver', 'watch']);
gulp.task('posttask', ['usemin']);
gulp.task('cleanup', [ 'clean']);
gulp.task('default', runAllTasks);
gulp.task('build', runAllTasks);
