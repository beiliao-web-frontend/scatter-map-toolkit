const $ = require('./dom.js');
const util = require('./util.js');
const Area = require('./area.js');

class Canvas extends $.class {

	constructor(selector, container) {

		super(selector);

		this.$container = $(container);
		this.$img = this.find('.pic');
		this.$areas = this.find('.areas');

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

			if ($area.data('endX') >= $area.data('startX')) {
				$area.css({
					left: toPersent($area.data('startX'), 'width'),
					width: toPersent($area.data('endX') - $area.data('startX'), 'width')
				});

				$area.data('x1', toPersent($area.data('startX'), 'width'));
				$area.data('x2', toPersent($area.data('endX'), 'width'));
			} else {
				$area.css({
					left: toPersent($area.data('endX'), 'width'),
					width: toPersent($area.data('startX') - $area.data('endX'), 'width')
				});

				$area.data('x1', toPersent($area.data('endX'), 'width'));
				$area.data('x2', toPersent($area.data('startX'), 'width'));
			}

			if ($area.data('endY') >= $area.data('startY')) {
				$area.css({
					top: toPersent($area.data('startY'), 'height'),
					height: toPersent($area.data('endY') - $area.data('startY'), 'height')
				});

				$area.data('y1', toPersent($area.data('startY'), 'height'));
				$area.data('y2', toPersent($area.data('endY'), 'height'));
			} else {
				$area.css({
					top: toPersent($area.data('endY'), 'height'),
					height: toPersent($area.data('startY') - $area.data('endY'), 'height')
				});

				$area.data('y1', toPersent($area.data('endY'), 'height'));
				$area.data('y2', toPersent($area.data('startY'), 'height'));
			}

		}

		this.on('mousedown', (e) => {

			if (e.button === 0 && e.target === this.$areas.get(0)) {
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

		$(document).on('mousemove', (e) => {

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

			if (
				x1 > 100 ||
				x1 < 0 ||
				x2 > 100 ||
				x2 < 0 ||
				y1 > 100 ||
				y1 < 0 ||
				y2 > 100 ||
				y2 < 0
			) {
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

	setImage(src) {
		this.$img.attr('src', src);
		this.$img.on('load', () => this.init(), true);
		return this;
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