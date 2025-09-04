export default [
	`{{return []->shuffle->toJSON = "[]"}}`,
	`{{return [1]->shuffle->toJSON = "[1]"}}`,
	`{{return range(5)->shuffle->toJSON != range(5)->toJSON}}`,
	`
		{{var result = range(5)->shuffle->toJSON}}
		{{return result->startsWith('[') && result->endsWith(']')}}
	`,
	(Histone, ret) => {
		Histone('{{return [range(200), range(200)->shuffle]}}').render(function(result, state) {
			if (!(result instanceof Array) || result.length !== 2) return ret(false);
			var first = result[0], second = result[1];
			if (!(first instanceof Array) || first.length !== 200) return ret(false);
			if (!(second instanceof Array) || second.length !== 200) return ret(false);
			if (JSON.stringify(first) === JSON.stringify(second)) return ret(false);
			ret(state === Histone.V_DIRTY);
		}, Histone.R_JS)
	},
];
