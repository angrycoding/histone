export default [
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{#2 * 2#}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_TREE, "2 * 2"]])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{#{{[1, 2, 3]}}#}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_TREE, [Constants.AST_NODELIST, [Constants.AST_ARRAY, 1, 2, 3]]]])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{#foo{{[1, 2, 3]}}bar#}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_TREE, [Constants.AST_NODELIST, "foo", [Constants.AST_ARRAY, 1, 2, 3], "bar"]]])
		);
	},
];