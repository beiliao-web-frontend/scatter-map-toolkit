(function(global) {

	/**
	 * 坐标范围
	 * @class Area
	 * @constructor
	 * @param {Object} data 包含构成范围的四个坐标点x1, x2, y1, y2
	 */
	class Area {

		constructor(data) {
			this.x1 = parseFloat(data.x1);
			this.x2 = parseFloat(data.x2);
			this.y1 = parseFloat(data.y1);
			this.y2 = parseFloat(data.y2);

			this.differenceX = this.x2 - this.x1;
			this.differenceY = this.y2 - this.y1;

			// 长宽之积为坐标范围的面积，计算权重的参数
			this.sumArea = Math.ceil(this.differenceX * this.differenceY);
		}

		/**
		 * 坐标范围内随机生成一个横坐标
		 * @method randomX
		 * @for Area
		 * @return {String} 横坐标，单位：百分比
		 */
		randomX() {
			return this.x1 + (this.differenceX * Math.random()) + '%';
		}

		/**
		 * 坐标范围内随机生成一个纵坐标
		 * @method randomX
		 * @for Area
		 * @return {String} 纵坐标，单位：百分比
		 */
		randomY() {
			return this.y1 + (this.differenceY * Math.random()) + '%';
		}

	}

	/**
	 * 坐标范围的分组
	 * @class Group
	 * @constructor
	 * @param {String} name 分组名
	 * @param {Array[Area]} areas 坐标范围集合
	 */
	class Group {

		constructor(name, areas = []) {
			this.name = name; // 分组名

			this.sumArea = 0; // 分组内坐标范围的总面积，计算权重的参数

			this.areas = areas.map((position) => {
				let area = new Area(position);

				this.sumArea += area.sumArea;

				return area;
			}); // 分组对应的坐标范围
		}

		/**
		 * 根据面积权重随机获取一个坐标范围
		 * @method randomArea
		 * @for Group
		 * @return {Area} 坐标范围对象
		 */
		randomArea() {

			let random = Math.floor(Math.random() * this.sumArea);
			let sumArea = 0;
			let result = null;

			this.areas.some((area) => {

				if (random >= sumArea && random <= sumArea + area.sumArea) {
					result = area;
					return true;
				}
				sumArea += area.sumArea;
			});

			return result;
		}

		/**
		 * 从分组内的坐标范围随机生成一个坐标
		 * @method random
		 * @for Group
		 * @return {Object} 坐标对象，x 横坐标， y 纵坐标
		 */
		random() {
			let area = this.randomArea();

			if (area) {
				return {
					x: area.randomX(),
					y: area.randomY()
				};
			}

			return null;

		}

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
	class ScatterMap {

		constructor(options) {
			let data = options.data; // 分组数据

			this.groups = {}; // 分组对象

			this.groupNames = []; // 所有分组名

			for (let name in data) {

				let group = new Group(name, data[name].areas); // 创建分组

				this.groups[name] = group;

				this.groupNames.push(name);

			}

		}

		/**
		 * 根据权重随机获取一个分组
		 * @method randomGroup
		 * @for ScatterMap
		 * @param {Array} [result=totalResult] 权重结果集，默认按面积计算权重
		 * @return {Group} 分组对象
		 */
		randomGroup(result = this.groupNames) {
			return this.groups[result[Math.floor(Math.random() * result.length)]];
		}

		/**
		 * 从特定分组随机获取坐标
		 * @method randomFromGroup
		 * @for ScatterMap
		 * @param {Array|String} [include=groupNames] 包含的分组，默认为全部分组
		 * @param {Array|String} [include=[]] 排除的分组，默认为空数组
		 * @return {Object} 坐标对象，x 横坐标， y 纵坐标
		 */
		randomFromGroup(include = this.groupNames, exclude = []) {

			if (!Array.isArray(include)) {
				include = [include];
			}

			if (!Array.isArray(exclude)) {
				exclude = [exclude];
			}

			let group = this.randomGroup(include.filter((name) => exclude.indexOf(name) === -1));

			return group && group.random();
		}

		/**
		 * 根据权重随机获取坐标
		 * @method random
		 * @for ScatterMap
		 * @return {Object} 坐标对象，x 横坐标， y 纵坐标
		 */
		random() {
			return this.randomGroup().random();
		}

	}

	global.ScatterMap = ScatterMap; // 暴露到全局变量

})(window);