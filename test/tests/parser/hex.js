export default [
	(Histone, ret, path, Constants) => {
		try { Histone(`{{0xG}}`) }
		catch (e) { return ret(true); }
		ret(false);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{0x0A}}`).getAST()) === 
			JSON.stringify('10')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[0x0a]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY, 10]])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{0X0A}}`).getAST()) === 
			JSON.stringify('10')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[0X0A]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY, 10]])
		);
	}
];
