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
			let position = {};

			if ($area.endX >= $area.startX) {
				$area.css({
					left: toPersent($area.startX, 'width'),
					width: toPersent($area.endX - $area.startX, 'width')
				});

				position.startX = toPersent($area.startX, 'width');
				position.endX = toPersent($area.endX, 'width');
			} else {
				$area.css({
					left: toPersent($area.endX, 'width'),
					width: toPersent($area.startX - $area.endX, 'width')
				});

				position.startX = toPersent($area.endX, 'width');
				position.endX = toPersent($area.startX, 'width');
			}

			if ($area.endY >= $area.startY) {
				$area.css({
					top: toPersent($area.startY, 'height'),
					height: toPersent($area.endY - $area.startY, 'height')
				});

				position.startY = toPersent($area.startY, 'height');
				position.endY = toPersent($area.endY, 'height');
			} else {
				$area.css({
					top: toPersent($area.endY, 'height'),
					height: toPersent($area.startY - $area.endY, 'height')
				});

				position.startY = toPersent($area.endY, 'height');
				position.endY = toPersent($area.startY, 'height');
			}

			$area.data({ position });
		}

		this.on('mousedown', (e) => {

			if (e.button === 0 && e.target === this.$areas.get(0)) {
				let $area = new Area();

				this.$currentArea = $area;

				this.$currentArea.data({
					startX: this.getAbs().x,
					startY: this.getAbs().y
				});

				this.$areas.append($area.get(0));
				this.$group.getActive().append($area);
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

			this.$currentArea = null;
		});
	}

	bind($group) {
		this.$group = $group;
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

	data(key) {
		return this[key];
	}

	getAbs(e = window.event) {
		return {
			x: e.pageX + this.$container.scrollLeft() - this.offset().left,
			y: e.pageY + this.$container.scrollTop() - this.offset().top
		};
	}

	update() {
		this.$img.width(util.toString(this.imgWidth * this.imgScale));
		this.$img.height(util.toString(this.imgHeight * this.imgScale));
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

	ready(event, handler) {
		this.onready = handler;
		return this;
	}

}

module.exports = Canvas;