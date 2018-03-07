const gulp = require('gulp');
const pump = require('pump'); // 处理错误
const fs = require('fs');     // 文件操作

module.exports = () => {
	return pump([
		gulp.src([
			'./../src/**/*',
			'!./../src/**/*.js',
			'!./../src/**/*.scss'
		]),
		gulp.dest('./../dist')
	], () => {
		fs.rmdirSync('./../dist/customize/module');
		fs.rmdirSync('./../dist/customize/lib');
	});
};