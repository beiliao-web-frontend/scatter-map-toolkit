module.exports = (url, method, data, callback) => {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				callback(xhr);
			}
		}
	};
	xhr.open(method, url, true);
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.send(JSON.stringify(data));
};