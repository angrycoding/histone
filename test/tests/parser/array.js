module.exports = [
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY]])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[1, 2, 3, 4]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY, 1, 2, 3, 4]])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[,,,,,,,,,]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY]])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[,,,,,,,,1, 2, 3, 4]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY, 1, 2, 3, 4]])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[1, 2, 3, 4,,,,,,,,,,,,]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY, 1, 2, 3, 4]])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[,,,,,,,,,1,,,,,,,, 2,,,,,,, 3,,,,,,,,,, 4,,,,,,,,,,,,]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY, 1, 2, 3, 4]])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[foo: 'bar', x: 'y', z: true]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_OBJECT, "bar", "foo", "y", "x", true, "z"]])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[foo: 'bar', x: 'y', z: true, foo: 'BLA_BLA']}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_OBJECT, "y", "x", true, "z", "BLA_BLA", "foo"]])
		);
	},
	(Histone, ret, path, Constants) => {
		try { Histone(`{{[hey: 1, 1, 2, 3]}}`) }
		catch (exception) { return ret(true); }
		ret(false);
	},
	(Histone, ret, path, Constants) => {
		try { Histone(`{{[1, 2, 3, hey: 1]}}`) }
		catch (exception) { return ret(true); }
		ret(false);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{["foo": 'bar', "x": 'y', 'z': true, foo: 'BLA_BLA']}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_OBJECT, "y", "x", true, "z", "BLA_BLA", "foo"]])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[10: 'bar', 20: 'y', 30: true, 40: 'BLA_BLA']}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_OBJECT, "bar", "10", "y", "20", true, "30", "BLA_BLA", "40"]])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[true: 'bar', false: 'y', this: true, if: 'BLA_BLA']}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_OBJECT, "bar", "true", "y", "false", true, "this", "BLA_BLA", "if"]])
		);
	}
];
