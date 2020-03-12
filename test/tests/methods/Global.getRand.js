module.exports = [
	'{{return getRand->isNumber}}',
	'{{return getRand != getRand}}',
	'{{return range(100)->map(=> getRand(UNDEFINED, 0))->every(i => i = 0)}}',
	'{{return range(100)->map(=> getRand(0, 0))->every(i => i = 0)}}',
	'{{return range(100)->map(=> getRand(1, 1))->every(i => i = 1)}}',
	'{{return range(100)->map(=> getRand(100, 100))->every(i => i = 100)}}',
	'{{return range(100)->map(=> getRand(0, 1))->every(i => i = 0 || i = 1)}}',
	'{{return range(100)->map(=> getRand(1, 0))->every(i => i = 0 || i = 1)}}',

	(Histone, ret) => {
		Histone('{{getRand(100, 100)}}').render(function(result, state) {
			ret(result === '100' && state === Histone.V_DIRTY);
		})
	},


	(Histone, ret) => {
		Histone('{{return range(10)->map(=> getRand)}}').render(function(result, state) {
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


	'{{return getSafeRand->isNumber}}',
	'{{return getSafeRand != getSafeRand}}',
	'{{return range(100)->map(=> getSafeRand(UNDEFINED, 0))->every(i => i = 0)}}',
	'{{return range(100)->map(=> getSafeRand(0, 0))->every(i => i = 0)}}',
	'{{return range(100)->map(=> getSafeRand(1, 1))->every(i => i = 1)}}',
	'{{return range(100)->map(=> getSafeRand(300, 300))->every(i => i = 300)}}',
	'{{return range(100)->map(=> getSafeRand(0, 1))->every(i => i = 0 || i = 1)}}',
	'{{return range(100)->map(=> getSafeRand(1, 0))->every(i => i = 0 || i = 1)}}',
	(Histone, ret) => {
		Histone('{{getSafeRand(299, 300)}}').render(function(result, state) {
			ret((result === '299' || result === '300') && state === Histone.V_CLEAN);
		})
	},

	(Histone, ret) => {
		Histone('{{return range(30)->map(=> getSafeRand)}}').render(function(result, state) {
			if (!(result instanceof Array)) return ret(false);
			if (result.length !== 30) return ret(false);
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