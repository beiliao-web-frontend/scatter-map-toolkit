const $ = require('./dom.js');

class Uploader {

	constructor(selector) {

		this.$el = $(selector);

		this.init();

		this.$el.on('change', () => {
			let file = this.$el.getElement().files[0];

			if (!file) {
				this.$el.value('');
				return false;
			}

			let flag = this.emit('choose', file);
			if (flag === false) {
				this.$el.value('');
				return false;
			}

			let reader = new FileReader();

			reader.onload = (e) => {
				this.emit('success', e.target.result, e);
			};

			reader.onerror = function(e) {
				this.emit('error', e);
			};

			reader.readAsDataURL(file);

			this.$el.value('');
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