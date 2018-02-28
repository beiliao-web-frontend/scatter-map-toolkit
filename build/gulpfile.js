const gulp = require('gulp');
const type = require('minimist')(process.argv.slice(2)).type;
const tasks = require('require-dir')('./tasks', {
	filter(fullPath) {
		// 如果是非开发环境则过滤掉watch的task
		return type === 'dev' || !/watch\.js$/.test(fullPath);
	}
});

let taskNames = [];

for (let taskName in tasks) {
	let taskItem = tasks[taskName];
	taskNames.push(taskName);
	gulp.task(taskName, taskItem);
}

gulp.task('default', taskNames);