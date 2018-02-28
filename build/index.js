const childProcess = require('child_process');
const path = require('path');
const chalk = require('chalk');
const type = process.argv[2];

if (['dev', 'prod'].indexOf(type) !== -1) {
	// 以子进程方式调用Gulp
	childProcess.fork(require.resolve('gulp/bin/gulp'), [
		'--gulpfile',
		path.resolve(__dirname, './gulpfile.js'),
		'--type',
		type
	], {
		cwd: __dirname
	});
}
