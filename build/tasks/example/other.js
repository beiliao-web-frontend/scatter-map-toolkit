const gulp = require('gulp');
const pump = require('pump'); // 处理错误
const fs = require('fs');     // 文件操作

const srcPath = './../src/example';
const destPath = './../example';

module.exports = () => {
	return pump([
		gulp.src([
			`${ srcPath }/**/*`,
			`!${ srcPath }/**/*.js`,
			`!${ srcPath }/**/*.scss`
		]),
		gulp.dest('./../example')
	], () => {
		if (fs.existsSync(`${ destPath }/module`)) {
			fs.rmdirSync(`${ destPath }/module`);
		}

		if (fs.existsSync(`${ destPath }/lib`)) {
			fs.rmdirSync(`${ destPath }/lib`);
		}
	});
};