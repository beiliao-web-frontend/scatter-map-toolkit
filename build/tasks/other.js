const gulp = require('gulp');
const pump = require('pump');                       // 处理错误

module.exports = (cb) => {
	const stream = [
		gulp.src([
			'./../src/**/*',
			'!./../src/**/*.js',
			'!./../src/**/*.scss'
		]),
		gulp.dest('./../dist')
	];

	pump(stream, cb);
};