module.exports = [
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{false}}`).getAST()) === 
			JSON.stringify('false')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[false]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY, false]])
		);
	}
];
