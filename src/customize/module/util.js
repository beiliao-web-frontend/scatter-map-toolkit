class Util {
	toFloat(str) {
		let result = str.match(/\d+/g);
		return parseFloat(result && (result.length > 1 ? result : result[0]));
	}

	toString(num, unit) {
		return num + unit;
	}
}

module.exports = new Util();