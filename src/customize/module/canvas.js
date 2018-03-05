const $ = require('./dom.js');
const Util = require('./util.js');
const widthUtil = new Util();
const heightUtil = new Util();

class Canvas {

	constructor(selector) {
		this.$el = $(selector);
		this.$img = this.$el.find('.pic');
		this.$areas = this.$el.find('.areas');

		this.$el.on('mousedown', () => {
			console.log(this.$el);
		});
	}

	setGroup($group) {
		this.$group = $group;
	}

	init() {
		this.scale = 1;
		this.$img.clearStyle();
		this.width = widthUtil.toFloat(this.$img.width());
		this.height = heightUtil.toFloat(this.$img.height());
		this.updateImage();
	}

	updateImage() {
		this.$img.width(widthUtil.toString(this.width * this.scale));
		this.$img.height(heightUtil.toString(this.height * this.scale));
	}

	setImage(src) {
		this.$img.attr('src', src);
		this.$img.on('load', () => this.init(), true);
	}

	zoomIn(count = 0.1) {
		this.scale += count;
		this.updateImage();
	}

	zoomOut(count = 0.1) {
		if (this.scale > count * 2) {
			this.scale -= count;
			this.updateImage();
		}
	}

}

module.exports = Canvas;