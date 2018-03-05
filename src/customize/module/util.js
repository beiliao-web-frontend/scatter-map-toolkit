class Util {
	toFloat(str) {
		str.match(/^(\d+)([a-zA-Z]*)$/);
		this.unit = RegExp.$2
		return RegExp.$1;
	}

	toString(num) {
		return num + this.unit
	}
}

module.exports = Util;