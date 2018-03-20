const $ = require('./dom.js');
const util = require('./util.js');
const Area = require('./area.js');

class Canvas extends $.class {

	constructor(selector, container) {

		super(selector);

		this.$container = $(container);
		this.$img = this.find('.js-pic');
		this.$areas = this.find('.js-areas');

		let self = this;

		function toPersent(val, type) {
			let w = util.toFloat(self.width()); // 地图范围的宽高
			let h = util.toFloat(self.height()); // 地图范围的宽高
			if (type === 'width') {
				return util.toString(val / w * 100, '%');
			} else if (type === 'height') {
				return util.toString(val / h * 100, '%');
			}
		}

		function update($area) {

			let startX = $area.data('startX');
			let endX = $area.data('endX');
			let startY = $area.data('startY');
			let endY = $area.data('endY');

			if (endX >= startX) {
				$area.css({
					left: toPersent(startX, 'width'),
					width: toPersent(endX - startX, 'width')
				});

				$area.data('x1', toPersent(startX, 'width'));
				$area.data('x2', toPersent(endX, 'width'));
			} else {
				$area.css({
					left: toPersent(endX, 'width'),
					width: toPersent(startX - endX, 'width')
				});

				$area.data('x1', toPersent(endX, 'width'));
				$area.data('x2', toPersent(startX, 'width'));
			}

			if (endY >= startY) {
				$area.css({
					top: toPersent(startY, 'height'),
					height: toPersent(endY - startY, 'height')
				});

				$area.data('y1', toPersent(startY, 'height'));
				$area.data('y2', toPersent(endY, 'height'));
			} else {
				$area.css({
					top: toPersent(endY, 'height'),
					height: toPersent(startY - endY, 'height')
				});

				$area.data('y1', toPersent(endY, 'height'));
				$area.data('y2', toPersent(startY, 'height'));
			}

		}

		this.on('mousedown', (e) => {
			let $target = $(e.target);
			if (e.button === 0 && !$target.hasClass('icon')) {
				let $area = new Area();

				this.$currentArea = $area;

				this.$currentArea.data({
					startX: this.getAbs().x,
					startY: this.getAbs().y
				});

				this.$areas.append($area);

				this.$groupList.$currentGroup.append($area);
			}

		});

		$(document).on('mousemove', () => {

			if (!this.$currentArea) {
				return;
			}

			let abs = this.getAbs();

			if (abs.x < 0) {
				abs.x = 0;
			} else if (abs.x > util.toFloat(this.width())) {
				abs.x = util.toFloat(this.width());
			}

			if (abs.y < 0) {
				abs.y = 0;
			} else if (abs.y > util.toFloat(this.height())) {
				abs.y = util.toFloat(this.height());
			}

			this.$currentArea.data({
				endX: abs.x,
				endY: abs.y
			});

			update(this.$currentArea);
		});

		$(document).on('mouseup', () => {

			if (!this.$currentArea) {
				return;
			}

			this.$currentArea.addClass('hover');

			let x1 = util.toFloat(this.$currentArea.data('x1'));
			let x2 = util.toFloat(this.$currentArea.data('x2'));
			let y1 = util.toFloat(this.$currentArea.data('y1'));
			let y2 = util.toFloat(this.$currentArea.data('y2'));

			function isError(count) {
				return count === undefined || count > 100 || count < 0;
			}

			if (isError(x1) || isError(x2) || isError(y1) || isError(y2)) {
				this.$currentArea.remove().emit('delete'); // 移除非法数据
			}

			this.$currentArea = null;
		});
	}

	bind($groupList) {
		this.$groupList = $groupList;
		return this;
	}

	init() {
		this.$img.css('width', '');
		this.$img.css('height', '');
		this.imgScale = 1;
		this.imgWidth = util.toFloat(this.$img.width());
		this.imgHeight = util.toFloat(this.$img.height());
		this.update();
		this.emit('ready');
		return this;
	}

	getAbs(e = window.event) {
		return {
			x: e.pageX + this.$container.scrollLeft() - this.offset().left,
			y: e.pageY + this.$container.scrollTop() - this.offset().top
		};
	}

	update() {
		this.$img.width(util.toString(this.imgWidth * this.imgScale, 'px'));
		this.$img.height(util.toString(this.imgHeight * this.imgScale, 'px'));
		return this;
	}

	append($area) {
		if (!util.isArea($area)) {
			return this;
		}

		this
			.find('.js-areas')
			.append($area);
	}

	setImage(src, cb) {
		this.$img.attr('src', src);
		this.$img.on('load', () => {
			this.init();
			if (typeof cb === 'function') {
				cb();
			}
		}, true);
		return this;
	}

	getImage() {
		return this.$img.attr('src');
	}

	zoomIn(count = 0.1) {
		this.imgScale += count;
		this.update();
		return this;
	}

	zoomOut(count = 0.1) {
		if (this.imgScale > count * 2) {
			this.imgScale -= count;
			this.update();
		}
		return this;
	}

	ready(handler) {
		this.onready = handler;
		return this;
	}

}

module.exports = Canvas;