export default [
	(Histone, ret) => {
		Histone('{{return []}}').render(function(result) {
			ret(result instanceof Array && result.length === 0);
		}, Histone.R_JS);
	},
	(Histone, ret) => {
		Histone('{{return [1, 2, 3]}}').render(function(result) {
			ret(result instanceof Array && result.length === 3);
		}, Histone.R_JS);
	},
	(Histone, ret) => {
		Histone('{{return [x:1, y:2, z:3]}}').render(function(result) {
			ret(
				result instanceof Object &&
				Object.keys(result).length === 3 &&
				Object.values(result).length === 3 &&
				JSON.stringify(result).startsWith('{') &&
				JSON.stringify(result).endsWith('}')
			);
		}, Histone.R_JS);
	},
	(Histone, ret) => {
		Histone('{{return [1:1, 2:2, 3:3]}}').render(function(result) {
			ret(
				result instanceof Object &&
				Object.keys(result).length === 3 &&
				Object.values(result).length === 3 &&
				JSON.stringify(result).startsWith('{') &&
				JSON.stringify(result).endsWith('}')
			);
		}, Histone.R_JS);
	},
	(Histone, ret) => {
		Histone('{{return [0:1, 2:2, 3:3]}}').render(function(result) {
			ret(
				result instanceof Object &&
				Object.keys(result).length === 3 &&
				Object.values(result).length === 3 &&
				JSON.stringify(result).startsWith('{') &&
				JSON.stringify(result).endsWith('}')
			);
		}, Histone.R_JS);
	},
	(Histone, ret) => {
		Histone('{{return [0:1, 1:2, 3:3]}}').render(function(result) {
			ret(
				result instanceof Object &&
				Object.keys(result).length === 3 &&
				Object.values(result).length === 3 &&
				JSON.stringify(result).startsWith('{') &&
				JSON.stringify(result).endsWith('}')
			);
		}, Histone.R_JS);
	},
	(Histone, ret) => {
		Histone('{{return [0:1, 1:2, 2:3]}}').render(function(result) {
			ret(
				result instanceof Array &&
				result.length === 3 &&
				JSON.stringify(result).startsWith('[') &&
				JSON.stringify(result).endsWith(']')
			);
		}, Histone.R_JS);
	},
];
