module.exports = [
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{global}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_GLOBAL]])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[global]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY, [Constants.AST_GLOBAL]]])
		);
	}
];
