const $ = require('./dom.js');
const Util = require('./util.js');
const Area = require('./area.js');

const widthUtil = new Util();
const heightUtil = new Util();

class Canvas {

	constructor(selector) {
		this.$el = $(selector);
		this.$container = $('#container');
		this.$img = this.$el.find('.pic');
		this.$areas = this.$el.find('.areas');

		let self = this;

		function position(e) {
			return {
				x: e.pageX + self.$container.scrollLeft() - self.$el.offset().left,
				y: e.pageY + self.$container.scrollTop() - self.$el.offset().top
			};
		}

		function toFloat(val) {
			return parseFloat(val.replace('px', ''));
		}

		function toPersent(val, type) {
			let w = toFloat(self.$el.width()); // 地图范围的宽高
			let h = toFloat(self.$el.height()); // 地图范围的宽高
			if (type === 'width') {
				return (val / w * 100) + '%';
			} else if (type === 'height') {
				return (val / h * 100) + '%';
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

		this.$el.on('mousedown', (e) => {

			if (e.button === 0 && e.target === this.$areas.getElement()) {
				let $area = new Area();

				this.$active = $area;

				this.$active.data({
					startX: position(e).x,
					startY: position(e).y
				});

				this.$areas.append($area.getElement());
				this.$group.getActive().append($area);
			}

		});

		$(document).on('mousemove', (e) => {

			if (!this.$active) {
				return;
			}

			let pos = position(e);

			if (pos.x < 0) {
				pos.x = 0;
			} else if (pos.x > toFloat(this.$el.width())) {
				pos.x = toFloat(this.$el.width());
			}

			if (pos.y < 0) {
				pos.y = 0;
			} else if (pos.y > toFloat(this.$el.height())) {
				pos.y = toFloat(this.$el.height());
			}

			this.$active.data({
				endX: pos.x,
				endY: pos.y
			});

			update(this.$active);
		});

		$(document).on('mouseup', () => {
			this.$active = null;
		});
	}

	bind($group) {
		this.$group = $group;
		return this;
	}

	init() {
		this.scale = 1;
		this.$img.clearStyle();
		this.width = widthUtil.toFloat(this.$img.width());
		this.height = heightUtil.toFloat(this.$img.height());
		this.emit('load');
		this.update();
		return this;
	}

	data(key) {
		return this[key];
	}

	update() {
		this.$img.width(widthUtil.toString(this.width * this.scale));
		this.$img.height(heightUtil.toString(this.height * this.scale));
		return this;
	}

	setImage(src) {
		this.$img.attr('src', src);
		this.$img.on('load', () => this.init(), true);
		return this;
	}

	zoomIn(count = 0.1) {
		this.scale += count;
		this.update();
		return this;
	}

	zoomOut(count = 0.1) {
		if (this.scale > count * 2) {
			this.scale -= count;
			this.update();
		}
		return this;
	}

	on(event, handler) {
		this[event + 'Handler'] = handler;
		return this;
	}

	emit(event, ...params) {
		if (typeof this[event + 'Handler'] === 'function') {
			return this[event + 'Handler'](...params);
		}
	}

}

module.exports = Canvas;