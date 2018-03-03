const $ = require('./dom.js');

class Canvas {

	constructor(selector) {
		this.$el = $(selector);
		this.$img = this.$el.find('img');
	}

	init() {
		this.width = this.$img.width();
		this.height = this.$img.height();
		this.scale = 1;
		this.updateImage();
	}

	updateImage() {
		this.$img.width(this.width * this.scale);
		this.$img.height(this.height * this.scale);
	}

	setImage(src) {
		this.$img.clearStyle();
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