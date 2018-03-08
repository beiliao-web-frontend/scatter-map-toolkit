const $ = require('./dom.js');
const Util = require('./util.js');
const Area = require('./area.js');

const widthUtil = new Util();
const heightUtil = new Util();

class Canvas {

	constructor(selector) {
		this.$el = $(selector);
		this.$img = this.$el.find('.pic');
		this.$areas = this.$el.find('.areas');

		function position(e) {
			return {
				x: e.pageX - this.$el.offset().left,
				y: e.pageY - this.$el.offset().top
			};
		}

		this.$el.on('mousedown', (e) => {
			this.$active = new Area();

			this.$active.update({
				startX: position(e).x,
				startY: position(e).y
			});

			this.$areas.append(this.$active);
			this.$group.$active.append(this.$active);
		});

		this.$el.on('mousemove', (e) => {

			if (!this.$active) {
				return;
			}

		});

		this.$el.on('mouseup', () => {
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
		this.update();
		return this;
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

}

module.exports = Canvas;