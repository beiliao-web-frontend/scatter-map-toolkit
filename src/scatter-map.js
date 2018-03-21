(function(global) {

	/**
	 * 坐标范围
	 * @class Area
	 * @constructor
	 * @param {Object} data 包含构成范围的四个坐标点x1, x2, y1, y2
	 */
	function Area(data) {

		let x1 = parseFloat(data.x1);
		let x2 = parseFloat(data.x2);
		let y1 = parseFloat(data.y1);
		let y2 = parseFloat(data.y2);

		let differenceX = x2 - x1;
		let differenceY = y2 - y1;

		// 长宽之积为坐标范围的面积，计算权重的参数
		this.product = Math.ceil(differenceX * differenceY);

		/**
		 * 坐标范围内随机生成一个横坐标
		 * @method randomX
		 * @for Area
		 * @return {String} 横坐标，单位：百分比
		 */
		this.randomX = function() {
			return x1 + (differenceX * Math.random()) + '%';
		};

		/**
		 * 坐标范围内随机生成一个纵坐标
		 * @method randomX
		 * @for Area
		 * @return {String} 纵坐标，单位：百分比
		 */
		this.randomY = function() {
			return y1 + (differenceY * Math.random()) + '%';
		};

	}

	/**
	 * 坐标范围的分组
	 * @class Group
	 * @constructor
	 * @param {String} name 分组名
	 * @param {Array[Area]} areas 坐标范围集合
	 */
	function Group(name, areas) {

		this.name = name; // 分组名

		this.areas = areas || []; // 分组对应的坐标范围

		this.sumArea = 0; // 分组内坐标范围的总面积，计算权重的参数

		let result = []; // 按面积为权重生成的结果集

		for (let i = 0; i < this.areas.length; i++) {

			let area = this.areas[i];

			this.sumArea += area.product;

			for (let j = 0; j < area.product; j++) {
				result.push(i);
			}
		}

		/**
		 * 根据面积权重随机获取一个坐标范围
		 * @method randomArea
		 * @for Group
		 * @return {Area} 坐标范围对象
		 */
		this.randomArea = function() {
			return this.areas[result[Math.floor(Math.random() * result.length)]];
		};

		/**
		 * 从分组内的坐标范围随机生成一个坐标
		 * @method random
		 * @for Group
		 * @return {Object} 坐标对象，x 横坐标， y 纵坐标
		 */
		this.random = function() {
			let area = this.randomArea();
			return {
				x: area.randomX(),
				y: area.randomY()
			};
		};

	}

	/**
	 * 随机坐标生成工具
	 * @class ScatterMap
	 * @constructor
	 * @exports
	 * @param {Object} [options] 配置项
	 *   @param {String} [options.image] 绘制坐标的地图
	 *   @param {Object} [options.data] 坐标范围分组数据
	 *     @param {Boolean} [options.data['分组名'].isShow] 是否绘制可见
	 *     @param {Array} [options.data['分组名'].Areas] 坐标范围数组，每个坐标范围包含x1, x2, y1, y2四个构成面的点
	 *   @param {Object} [options.setting] 设置项
	 *     @param {Boolean} [options.resize] 是否重置宽高
	 *       @param {Boolean} [options.width] 重置宽度
	 *       @param {Boolean} [options.height] 重置高度
	 */
	function ScatterMap(options) {

		let data = options.data; // 分组数据

		let groups = {}; // 分组对象

		let groupNames = []; // 所有分组名

		let totalResult = []; // 按面积为权重生成的总结果集

		for (let name in data) {

			let group = new Group(name, data[name].areas.map((position) => new Area(position))); // 创建分组

			for (let i = 0; i < group.sumArea; i++) {
				totalResult.push(name);
			}

			groups[name] = group;

			groupNames.push(name);

		}

		this.groupNames = groupNames;

		/**
		 * 根据权重随机获取一个分组
		 * @method randomGroup
		 * @for ScatterMap
		 * @param {Array} [result=totalResult] 权重结果集，默认按面积计算权重
		 * @return {Group} 分组对象
		 */
		this.randomGroup = function(result) {

			result = result || totalResult;

			return groups[result[Math.floor(Math.random() * result.length)]];
		};

		/**
		 * 从特定分组随机获取坐标
		 * @method randomFromGroup
		 * @for ScatterMap
		 * @param {Array|String} [include=groupNames] 包含的分组，默认为全部分组
		 * @param {Array|String} [include=[]] 排除的分组，默认为空数组
		 * @param {Boolean} [isFixed=false] 是否使用权重
		 * @return {Object} 坐标对象，x 横坐标， y 纵坐标
		 */
		this.randomFromGroup = function(include, exclude, isFixed) {

			include = include || groupNames;

			exclude = exclude || [];

			if (!Array.isArray(include)) {
				include = [include];
			}

			if (!Array.isArray(exclude)) {
				exclude = [exclude];
			}

			if (include.length === 1) {
				return groups[include[0]].random();
			}

			let group = isFixed ?
				this.randomGroup(include.filter((name) => {
					return exclude.indexOf(name) === -1;
				})) :
				this.randomGroup(totalResult.filter((name) => {
					return include.indexOf(name) !== -1 && exclude.indexOf(name) === -1;
				}));

			if (group) {
				return group.random();
			}

			return null;
		};

		/**
		 * 根据权重随机获取坐标
		 * @method random
		 * @for ScatterMap
		 * @return {Object} 坐标对象，x 横坐标， y 纵坐标
		 */
		this.random = function() {
			return this.randomGroup().random();
		};

		/**
		 * 不根据权重随机获取坐标
		 * @method random
		 * @for ScatterMap
		 * @return {Object} 坐标对象，x 横坐标， y 纵坐标
		 */
		this.randomFixed = function() {
			return this.randomGroup(groupNames).random();
		};

	}

	global.ScatterMap = ScatterMap; // 暴露到全局变量

})(window);