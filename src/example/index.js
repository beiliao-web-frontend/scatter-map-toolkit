const hash = window.location.hash.replace(/^#/, '');

const $points = document.getElementById('points');

function updatePoint($point, position, config) {

	if (!$point || !position || !config) {
		return;
	}

	let scale = config.minScale + ((config.maxScale - config.minScale) * Math.random());
	let delay = config.minDelay + ((config.maxDelay - config.minDelay) * Math.random());

	$point.style.cssText = `transform: scale(${ scale }); top: ${ position.y }; left: ${ position.x };`;

	$point.className = 'point';

	setTimeout(() => {
		$point.className = 'point run';
	}, delay);
}

function start(data, configs) {

	const scatterMap = new ScatterMap(data);

	function position(config) {
		if (!config.include && !config.exculde) {

			if (config.fixed) {
				return scatterMap.randomFixed();

			} else {
				return scatterMap.random();
			}
		} else {
			return scatterMap.randomFromGroup(config.include, config.exculde, config.fixed);
		}
	}

	for (let i = 0; i < configs.length; i++) {
		let config = configs[i];

		config.minDelay = 300;
		config.maxDelay = 2000;

		for (let j = 0; j < config.count; j++) {

			let $point = document.createElement('span');

			$point.addEventListener('animationend', () => {
				updatePoint($point, position(config), config);
			});

			updatePoint($point, position(config), config);

			$points.appendChild($point);

		}
	}
}

function ajax(url, options) {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				options.success(xhr);
			}
		}
	};
	xhr.open(options.method, url, true);
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.send(JSON.stringify(options.data || {}));
}

function init() {
	let url = '';

	if (hash) {
		url = '/example/online.json';
	} else {
		url = '/example/example.json';
	}

	ajax(url, {
		method: 'GET',
		success(res) {
			try {

				let data = JSON.parse(res.responseText);

				let $pic = document.getElementById('pic');

				$pic.onload = () => {
					if (hash) {
						start(data, [{
							fixed: true,
							count: 500,
							minScale: 0.2,
							maxScale: 1.2
						}]);

					} else {

						let $main = document.getElementById('main');

						$main.className = 'main example';

						start(data, [{
							include: ['广东', '河南', '湖南', '山东', '河北'],
							count: 400,
							minScale: 0.3,
							maxScale: 1.2
						}, {
							include: ['江苏', '山西', '广西', '安徽', '湖北', '陕西', '四川', '云南', '江西'],
							count: 250,
							minScale: 0.2,
							maxScale: 0.8
						}, {
							exculde: '其他',
							fixed: true,
							count: 300,
							minScale: 0.1,
							maxScale: 0.3
						}, {
							include: '其他',
							fixed: true,
							count: 50,
							minScale: 1,
							maxScale: 1.5
						}]);
					}
				};

				$pic.src = data.image;

			} catch (err) {
				throw new Error('JSON解析出错');
			}
		}
	});
}

init();
