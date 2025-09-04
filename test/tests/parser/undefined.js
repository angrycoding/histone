export default [
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{undefined}}`).getAST()) === 
			JSON.stringify('')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[undefined]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY, [Constants.AST_UNDEFINED]]])
		);
	}
];
