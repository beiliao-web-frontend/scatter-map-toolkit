const $ = require('./dom.js');

let $body = $('body');

let $popup = $(`<div class="popup">
	<div class="box">
		<div class="js-title title"></div>
		<div class="js-content content"></div>
		<div class="btns">
			<button class="js-cancel cancel">取消</button>
			<button class="js-confirm confirm ml">确定</button>
		</div>
	</div>
</div>`);

let $title = $popup.find('.js-title');
let $content = $popup.find('.js-content');
let $cancel = $popup.find('.js-cancel');
let $confirm = $popup.find('.js-confirm');

$popup.on('animationend', () => {
	if ($popup.hasClass('fade-out')) {
		$popup.removeClass('fade-out');
		$popup.remove();
	}

	if ($popup.hasClass('fade-in')) {
		$popup.removeClass('fade-in');
	}
});

module.exports = (options = {}) => {

	if (typeof options === 'string') {
		options = {
			content: options
		};
	}

	$title.text(options.title || '提示');

	$content.html(options.content || '');

	if (options.cancelText) {
		$cancel.text(options.cancelText);
	}

	$cancel.on('click', () => {
		if (typeof options.cancel === 'function') {
			let flag = options.cancel();
			if (flag === 'false') {
				return;
			}
		}
		$popup.addClass('fade-out');
	}, true);

	if (options.confirmText) {
		$confirm.text(options.confirmText);
	}

	$confirm.on('click', () => {
		if (typeof options.confirm === 'function') {
			let flag = options.confirm();
			if (flag === 'false') {
				return;
			}
		}
		$popup.addClass('fade-out');
	}, true);

	$body.append($popup.addClass('fade-in'));
};