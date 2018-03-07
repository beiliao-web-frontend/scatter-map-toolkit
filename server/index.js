require('./../build/index');
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const config = require('./config');

const basePath = path.join(__dirname, '..', 'dist');

const route = {
	'/': path.join(basePath, 'customize', 'customize.html'),
	'/example': path.join(basePath, 'example', 'example.html')
};

const contentTypes = {
	html: 'text/html',
	js: 'text/javascript',
	css: 'text/css'
};

http.createServer((req, res) => {
	let pathName = url.parse(req.url).pathname;

	let filePath = /\.([\W\w]+)$/.test(pathName) ?
		path.join(basePath, pathName) : // 如果是文件
		route[pathName]; // 如果是页面

	let type = filePath.slice(filePath.lastIndexOf('.') + 1); // 获取访问资源后缀名
	res.writeHead(200, {
		'Content-Type': contentTypes[type] || 'application/octet-stream'
	});

	if (filePath) {
		fs.readFile(filePath, function(err, file) {
			if (err) {
				res.writeHead(404);
				res.end('404 NOT FOUND...');
			} else {
				res.end(file);
			}
		});
	} else {
		res.writeHead(404);
		res.end('404 NOT FOUND...');
	}

}).listen(config.port);