module.exports = (url, options) => {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				if (typeof options.success === 'function') {
					options.success(xhr);
				}
			} else {
				if (typeof options.success === 'function') {
					options.error(xhr);
				}
			}
		}
	};
	xhr.open(options.method, url, true);
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.send(JSON.stringify(options.data || {}));
};