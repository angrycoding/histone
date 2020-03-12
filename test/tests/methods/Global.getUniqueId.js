module.exports = [
	'{{return getUniqueId->isString}}',
	'{{return getUniqueId->length = 36}}',
	'{{return getUniqueId != getUniqueId}}',
	(Histone, ret) => {
		Histone('{{return range(10)->map(=> getUniqueId)}}').render(function(result, state) {
			if (!(result instanceof Array)) return ret(false);
			if (result.length !== 10) return ret(false);
			if (state !== Histone.V_DIRTY) return ret(false);
			for (var c = 0; c < result.length; c++) {
				if (result.indexOf(result[c], c + 1) !== -1) {
					return ret(false);
				}
			}
			ret(true);
		}, Histone.R_JS)
	},
	'{{return getSafeUniqueId->isString}}',
	'{{return getSafeUniqueId->length = 36}}',
	'{{return getSafeUniqueId != getSafeUniqueId}}',
	(Histone, ret) => {
		Histone('{{return range(10)->map(=> getSafeUniqueId)}}').render(function(result, state) {
			if (!(result instanceof Array)) return ret(false);
			if (result.length !== 10) return ret(false);
			if (state !== Histone.V_CLEAN) return ret(false);
			for (var c = 0; c < result.length; c++) {
				if (result.indexOf(result[c], c + 1) !== -1) {
					return ret(false);
				}
			}
			ret(true);
		}, Histone.R_JS)
	},
];