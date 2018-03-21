(function(global) {

	function Area(data) {

		let x1 = parseFloat(data.x1);
		let x2 = parseFloat(data.x2);
		let y1 = parseFloat(data.y1);
		let y2 = parseFloat(data.y2);

		let differenceX = x2 - x1;
		let differenceY = y2 - y1;

		this.product = Math.ceil(differenceX * differenceY);

		this.randomX = function() {
			return x1 + (differenceX * Math.random()) + '%';
		};

		this.randomY = function() {
			return y1 + (differenceY * Math.random()) + '%';
		};

	}

	function Group(name, areas) {

		this.name = name;

		this.areas = areas || [];

		this.sumArea = 0;

		let result = []; // 按面积为权重生成的结果集

		for (let i = 0; i < this.areas.length; i++) {

			let area = this.areas[i];

			this.sumArea += area.product;

			for (let j = 0; j < area.product; j++) {
				result.push(i);
			}
		}

		this.randomArea = function() {
			return this.areas[result[Math.floor(Math.random() * result.length)]];
		};

		this.random = function() {
			let area = this.randomArea();
			return {
				x: area.randomX(),
				y: area.randomY()
			};
		};

	}

	function ScatterMap(options) {

		let data = options.data;

		let groups = {};

		let groupNames = [];

		let totalResult = []; // 按面积为权重生成的结果集

		for (let name in data) {

			let group = new Group(name, data[name].areas.map((position) => new Area(position)));

			for (let i = 0; i < group.sumArea; i++) {
				totalResult.push(name);
			}

			groups[name] = group;

			groupNames.push(name);

		}

		this.groupNames = groupNames;

		this.randomGroup = function(result) {

			result = result || totalResult;

			return groups[result[Math.floor(Math.random() * result.length)]];
		};

		this.randomFromGroup = function(include, exclude) {

			include = include || groupNames;

			exclude = exclude || [];

			if (typeof include === 'string') {
				include = [include];
			}

			if (typeof exclude === 'string') {
				exclude = [exclude];
			}

			if (include.length === 1) {
				return groups[include[0]].random();
			}

			let group = this.randomGroup(totalResult.filter((name) => {
				return include.indexOf(name) !== -1 && exclude.indexOf(name) === -1;
			}));

			if (group) {
				return group.random();
			}

			return null;
		};

		this.random = function() {
			return this.randomGroup().random();
		};

		this.randomFixed = function() {
			return this.randomGroup(groupNames).random();
		};

	}

	global.ScatterMap = ScatterMap;

})(window);