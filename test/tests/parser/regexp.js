module.exports = [
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{/foo/}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_REGEXP, 'foo']])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{/foo/i}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_REGEXP, 'foo', 'i']])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{/foo/m}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_REGEXP, 'foo', 'm']])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{/foo/g}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_REGEXP, 'foo', 'g']])
		);
	},
	(Histone, ret, path, Constants) => {
		try { Histone(`{{/foo/f}}`) }
		catch (exception) { return ret(true) }
		ret(false)
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{/foo/img}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_REGEXP, 'foo', 'gim']])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{/foo/gim}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_REGEXP, 'foo', 'gim']])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{/foo/mig}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_REGEXP, 'foo', 'gim']])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{/foo/mi}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_REGEXP, 'foo', 'im']])
		);
	}
];
