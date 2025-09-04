export default [
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{this}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_THIS]])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[this]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY, [Constants.AST_THIS]]])
		);
	}
];
