// 基于rem的等比缩放
function resetFontSize() {
	var docElt = document.documentElement;
	docElt.style.fontSize = Math.min(
		Math.max(0.8, docElt.clientWidth / 1440), 1.2
	) * (window.remBase || 100) + 'px';
	console.log(docElt.clientWidth / 1440);
	return resetFontSize;
}

window.addEventListener('resize', resetFontSize(), false);