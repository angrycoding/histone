export default [
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{null}}`).getAST()) === 
			JSON.stringify('null')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[null]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY, null]])
		);
	}
];
