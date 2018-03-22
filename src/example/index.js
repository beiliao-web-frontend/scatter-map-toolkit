const hash = window.location.hash.replace(/^#/, '');

const $points = document.getElementById('points');

const config = {
	level1: {
		minScale: 0.1,
		maxScale: 0.3,
		minDelay: 200,
		maxDelay: 1600
	},
	level2: {
		minScale: 0.2,
		maxScale: 0.5,
		minDelay: 300,
		maxDelay: 1700
	},
	level3: {
		minScale: 0.5,
		maxScale: 0.7,
		minDelay: 400,
		maxDelay: 1800
	},
	level4: {
		minScale: 0.8,
		maxScale: 1.2,
		minDelay: 500,
		maxDelay: 2000
	}
};

/**
 * 更新点的状态和样式
 * @method updatePoint
 * @param {Node} [$point] 节点
 * @param {Object} [position] 坐标
 * @param {Object} [config] 配置项
 */
function updatePoint($point, position, config) {

	if (!$point || !position || !config) {
		return;
	}

	let scale = config.minScale + ((config.maxScale - config.minScale) * Math.random()); // 随机缩放倍数
	let delay = config.minDelay + ((config.maxDelay - config.minDelay) * Math.random()); // 随机延迟时间

	$point.style.cssText = `transform: scale(${ scale }); top: ${ position.y }; left: ${ position.x };`;

	$point.className = 'point';

	setTimeout(() => {
		$point.className = 'point run';
	}, delay);
}

/**
 * 开始创建节点
 * @method start
 * @param {Object} [data] 节点数据
 * @param {Object} [configs] 配置项
 */
function start(data, configs) {

	const scatterMap = new ScatterMap(data); // 工具实例化

	if (!Array.isArray(configs)) {
		configs = [configs];
	}

	function position(config) {
		if (!config.include && !config.exculde) { // 如果不是特定分组
			return scatterMap.random(); // 根据权重随机获取坐标
		} else {
			return scatterMap.randomFromGroup(config.include, config.exculde); // 返回特定条件下分组的坐标
		}
	}

	for (let i = 0; i < configs.length; i++) {
		let config = configs[i];

		for (let j = 0; j < config.count; j++) {

			let $point = document.createElement('span');

			$point.addEventListener('animationend', () => { // 动画结束后
				updatePoint($point, position(config), config);
			});

			updatePoint($point, position(config), config);

			$points.appendChild($point);

		}
	}
}

// 异步请求
function ajax(url, options) {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				if (typeof options.success === 'function') {
					let data = null;
					try {
						data = JSON.parse(xhr.responseText);
					} catch (err) {
						throw err;
					}
					options.success(data);
				}
			} else {
				if (typeof options.success === 'function') {
					options.error(xhr);
				}
			}
		}
	};
	xhr.open(options.method, url, true);
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.send(JSON.stringify(options.data || {}));
}

// 初始化
function init() {
	let url = '';

	if (hash) { // 如果有hash值，则为在线预览
		url = '/example/online.json';
	} else { // 否则为例子
		url = '/example/example.json';
	}

	ajax(url, {
		method: 'GET',
		success(data) {

			let $pic = document.getElementById('pic');

			$pic.onload = () => {
				if (hash) {
					start(data, {
						count: 500,
						minScale: 0.2,
						maxScale: 1.2,
						minDelay: 300,
						maxDelay: 2000
					});

				} else {

					let $main = document.getElementById('main');

					$main.className = 'main example';

					ajax('/data', {
						method: 'GET',
						success(res) {
							if (res.code === 200) {
								start(data, res.data.map((item) => {
									let conf = config[item.level];
									return {
										include: item.name,
										count: item.count,
										...conf
									};
								}));
							}
						}
					});
				}
			};

			$pic.src = data.image;
		}
	});
}

init();
