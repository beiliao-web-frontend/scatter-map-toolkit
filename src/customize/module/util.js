const Uploader = require('./uploader.js');
const Canvas = require('./canvas.js');
const GroupList = require('./group-list.js');
const GroupItem = require('./group-item.js');
const Area = require('./area.js');
const DOM = require('./dom.js').class;

module.exports.toFloat = (str) => {
	if (typeof str !== 'string') {
		return;
	}
	let result = str.match(/\d+/g);
	return parseFloat(result && (result.length > 1 ? result : result[0]));
};

module.exports.toString = (num, unit) => {
	return num + unit;
};

module.exports.isCanvas = (object) => {
	return object instanceof Canvas;
};

module.exports.isGroupList = (object) => {
	return object instanceof GroupList;
};

module.exports.isGroupItem = (object) => {
	return object instanceof GroupItem;
};

module.exports.isUploader = (object) => {
	return object instanceof Uploader;
};

module.exports.isArea = (object) => {
	return object instanceof Area;
};

module.exports.isDOM = (object) => {
	return object instanceof DOM;
};