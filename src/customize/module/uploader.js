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

			let flag = self.emit('choose', file);
			if (flag === false) {
				this.value = '';
				return false;
			}

			let reader = new FileReader();

			reader.onload = function(e) {
					self.emit('success', e.target.result, e);
			};

			reader.onerror = function(e) {
				self.emit('error', e);
			};

			reader.readAsDataURL(file);

			this.value = '';
		});
	}

	init() {
		this.successHandler = () => {};
		this.errorHandler = () => alert((this.options.name || '文件') + '读取错误');
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

module.exports = Uploader;