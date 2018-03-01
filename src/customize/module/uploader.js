const $ = require('./dom.js');

class Uploader {

	constructor(selector) {

		let self = this;

		this.$el = $(selector);

		this.init();

		this.$el.on('change', function() {
			let file = this.files[0];

			if (!file) {
				this.value = '';
				return false;
			}

			if (typeof self.chooseHandeler === 'function') {
				let flag = self.chooseHandeler(file);
				if (flag === false) {
					this.value = '';
					return false;
				}
			}

			let reader = new FileReader();

			reader.onload = function(e) {
				if (typeof self.successHandeler === 'function') {
					self.successHandeler(e.target.result, e);
				}
			};

			reader.onerror = function(e) {
				if (typeof self.errorHandeler === 'function') {
					self.errorHandeler(e);
				}
			};

			reader.readAsDataURL(file);

			this.value = '';
		});
	}

	init() {
		this.successHandeler = () => {};
		this.errorHandeler = () => alert((this.options.name || '文件') + '读取错误');
		this.$el.removeAttr('accept');
	}

	open(options) {
		this.init();
		this.options = options || {};

		if (this.options.accept) {
			this.$el.attr('accept', options.accept);
		}

		this.$el.click();

		return this;

	}

	choose(handler) {
		this.chooseHandeler = handler;
	}

	success(handler) {
		this.successHandeler = handler;
		return this;
	}

	error(handler) {
		this.errorHandeler = handler;
		return this;
	}
}

module.exports = Uploader;