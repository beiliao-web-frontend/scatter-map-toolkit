const $ = require('./dom.js');
const toast = require('./toast.js');

class Uploader extends $.class {

	constructor(selector) {

		super(selector);

		this.on('change', () => {
			let file = this.data('files', undefined, true)[0];

			if (!file) {
				this.value('');
				return false;
			}

			let reader = new FileReader();

			reader.onload = (e) => {
				this.emit('success', e.target.result, e);
			};

			reader.onerror = (e) => {
				this.emit('error', e);
			};

			reader.readAsDataURL(file);

			this.value('');
		});

		this.onerror = () => toast((this.options.name || '文件') + '读取错误', 'error');

	}

	open(options) {

		this.options = options || {};

		if (this.options.accept) {
			this.attr('accept', options.accept);
		} else {
			this.removeAttr('accept');
		}

		this.click();

		return this;
	}

	success(handler) {
		this.onsuccess = handler;
	}

	error(handler) {
		this.onerror = handler;
	}
}

module.exports = Uploader;