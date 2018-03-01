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

	zoomIn() {
		this.scale += 0.1;
		this.updateImage();
	}

	zoomOut() {
		if (this.scale > 0.2) {
			this.scale -= 0.1;
			this.updateImage();
		}
	}

}

module.exports = Canvas;