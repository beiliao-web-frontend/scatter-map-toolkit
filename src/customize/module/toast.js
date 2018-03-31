const $ = require('./dom.js');

let $body = $('body');

let $toast = $(`<div class="toast">
	<i class="js-icon icon"></i>
	<span class="js-text"></span>
</div>`);

let $icon = $toast.find('.js-icon');
let $text = $toast.find('.js-text');

$toast.on('animationend', () => {
	$toast.remove();
});

module.exports = (str, type = 'prompt') => {
	$toast
		.removeClass('success')
		.removeClass('error')
		.removeClass('prompt')
		.addClass(type);

	$icon
		.removeClass('icon-success')
		.removeClass('icon-error')
		.removeClass('icon-prompt')
		.addClass(`icon-${ type }`);

	$text.text(str);

	$body.append($toast);
};