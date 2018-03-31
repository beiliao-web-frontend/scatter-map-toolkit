const gulp = require('gulp');

function changeHandler(event) {
	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

const customize = './../src/customize';
const example = './../src/example';
const scatterMap = './../src/scatter-map.js';

module.exports = () => {
	gulp.watch(`${ customize }/**/*.scss`, ['customize/scss']).on('change', changeHandler);
	gulp.watch(`${ customize }/**/*.js`, ['customize/js']).on('change', changeHandler);
	gulp.watch([
		`${ customize }/**/*`,
		`!${ customize }/**/*.js`,
		`!${ customize }/**/*.scss`
	], ['customize/other']).on('change', changeHandler);

	gulp.watch(`${ example }/**/*.scss`, ['example/scss']).on('change', changeHandler);
	gulp.watch(`${ example }/**/*.js`, ['example/js']).on('change', changeHandler);
	gulp.watch([
		`${ example }/**/*`,
		`!${ example }/**/*.js`,
		`!${ example }/**/*.scss`
	], ['example/other']).on('change', changeHandler);

	gulp.watch(scatterMap, ['scatter-map']).on('change', changeHandler);
};