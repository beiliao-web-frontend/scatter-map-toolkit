require('./../build/index');
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const config = require('./config');

const basePath = path.join(__dirname, '..', 'dist');

const route = {
	'/': path.join(basePath, 'customize', 'customize.html'),
	'/example': path.join(basePath, 'example', 'example.html'),
	'/save': function(req, res) {
		fs.writeFile(path.join(basePath, 'example', 'data.json'), JSON.stringify(req.body, null, 2), (err) => {
			if (err) {
				res.end(JSON.stringify({
					errcode: 500,
					errmsg: '文件写入错误'
				}));
				return;
			}

			res.end(JSON.stringify({
				errcode: 200,
				data: '/example/data.json'
			}));
		});
	}
};

const contentTypes = {
	html: 'text/html',
	js: 'text/javascript',
	css: 'text/css'
};

http.createServer((req, res) => {
	let pathName = url.parse(req.url).pathname;

	let result = /\.([\W\w]+)$/.test(pathName) ?
		path.join(basePath, pathName) : // 如果是文件
		route[pathName]; // 如果是页面或者接口

	result = result || '';

	if (typeof result === 'function') {
		let postData = ''; // post请求的参数
		let getData = url.parse(req.url, true).query; // get请求的参数

		res.writeHead(200, {
			'Content-Type': 'application/json'
		});

		// 请求数据时
		req.on('data', (data) => {
			postData += data;
		});

		// 请求结束时
		req.on('end', () => {
			req.body = JSON.parse(postData); // 设置参数
			req.query = getData; // 设置参数
			result(req, res);
		});
	} else {
		let type = result.slice(result.lastIndexOf('.') + 1); // 获取访问资源后缀名

		res.writeHead(200, {
			'Content-Type': contentTypes[type] || 'application/octet-stream'
		});

		if (result) {
			fs.readFile(result, function(err, file) {
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
	}

}).listen(config.port);