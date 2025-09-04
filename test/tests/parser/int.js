export default [
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{10}}`).getAST()) === 
			JSON.stringify('10')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[10]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY, 10]])
		);
	}
];
