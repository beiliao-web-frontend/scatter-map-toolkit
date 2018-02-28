const gulp = require('gulp');

function changeHandler(event) {
	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

module.exports = () => {
	gulp.watch('./../src/**/*.scss', ['scss']).on('change', changeHandler);
	gulp.watch('./../src/**/*.js', ['js']).on('change', changeHandler);
	gulp.watch([
		'./../src/**/*',
		'!./../src/**/*.js',
		'!./../src/**/*.scss'
	], ['other']).on('change', changeHandler);
};