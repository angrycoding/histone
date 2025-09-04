export default [
	(Histone, ret, path, Constants) => {
		try { Histone(`{{0b1012}}`) }
		catch (e) { return ret(true); }
		ret(false);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{0b1010}}`).getAST()) === 
			JSON.stringify('10')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[0b1010]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY, 10]])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{0B1010}}`).getAST()) === 
			JSON.stringify('10')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[0B1010]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY, 10]])
		);
	}
];
