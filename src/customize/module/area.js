const $ = require('./dom.js');

class Area extends $.class {
	constructor() {
		super(`<div class="area">
			<i class="icon icon-error"></i>
		</div>`);

		this
			.find('.icon')
			.on('click', () => {
				console.log(123);
				this.remove();
				this.emit('delete');
			});
	}
}

module.exports = Area;