require('./../build/index');
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const qs = require('querystring');

const config = require('./config');

const basePath = path.join(__dirname, '..');

const route = {
	'/'(req, res) {
		res.writeHead(302, { 'Location': '/customize' }); // 重定向
		res.end();
	},
	'/customize': path.join(basePath, 'customize', 'index.html'),
	'/example': path.join(basePath, 'example', 'index.html'),
	'/data'(req, res) {
		let provinces = ['新疆', '西藏', '甘肃', '青海', '四川', '云南', '内蒙古', '贵州', '广西', '广东', '海南', '湖南', '江西', '福建', '台湾', '浙江', '河南', '安徽', '湖北', '重庆', '陕西', '宁夏', '山西', '河北', '北京', '天津', '山东', '江苏', '辽宁', '吉林', '黑龙江', '上海', '澳门', '香港'];

		let config = {
			level1: {
				include: ['天津', '北京', '上海', '香港', '澳门'],
				minCount: 3,
				maxCount: 6
			},
			level2: {
				minCount: 5,
				maxCount: 15
			},
			level3: {
				include: ['江苏', '山西', '广西', '安徽', '湖北', '陕西', '四川', '云南', '江西'],
				minCount: 20,
				maxCount: 40
			},
			level4: {
				include: ['广东', '河南', '湖南', '山东', '河北'],
				minCount: 80,
				maxCount: 120
			}
		};

		res.end(JSON.stringify({
			code: 200,
			data: provinces.map((province) => {

				for (let level in config) {
					let conf = config[level];

					if (conf.include && conf.include.indexOf(province) !== -1) {

						return {
							name: province,
							level: level,
							count: conf.minCount + Math.round(Math.random() * (conf.maxCount - conf.minCount))
						};
					}
				}

				return {
					name: province,
					level: 'level2',
					count: config.level2.minCount + Math.round(Math.random() * (config.level2.maxCount - config.level2.minCount))
				};

			})
		}));
	},
	'/save'(req, res) {

		let type = req.query.type;

		if (['customize', 'example'].indexOf(type) === -1) {
			res.end(JSON.stringify({
				code: 500,
				errmsg: '参数错误'
			}));
			return;
		}

		let filePath = {
			customize: '/customize/options.json',
			example: '/example/online.json'
		};

		fs.writeFile(path.join(basePath, filePath[type]), JSON.stringify(req.body, null, 2), (err) => {
			if (err) {
				res.end(JSON.stringify({
					code: 500,
					errmsg: '文件写入错误'
				}));
				return;
			}

			res.end(JSON.stringify({
				code: 200,
				data: filePath[type]
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
			try {
				req.body = JSON.parse(postData); // 设置参数
			} catch (err) {
				req.body = qs.parse(postData); // 设置参数
			}
			req.query = getData; // 设置参数
			result(req, res);
		});
	} else if (result) {
		let type = result.slice(result.lastIndexOf('.') + 1); // 获取访问资源后缀名

		res.writeHead(200, {
			'Content-Type': contentTypes[type] || 'application/octet-stream'
		});

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

}).listen(config.port);

console.log(`> Listening at http://localhost:${ config.port }/\n`);