module.exports = [
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{true}}`).getAST()) === 
			JSON.stringify('true')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[true]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY, true]])
		);
	}
];
