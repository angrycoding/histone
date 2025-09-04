export default [
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{.1}}`).getAST()) === 
			JSON.stringify('0.1')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{0.2}}`).getAST()) === 
			JSON.stringify('0.2')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[.3]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY, 0.3]])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{[3.14]}}`).getAST()) === 
			JSON.stringify([Constants.AST_NODELIST, [Constants.AST_ARRAY, 3.14]])
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{.1e0}}`).getAST()) === 
			JSON.stringify('0.1')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{.1e1}}`).getAST()) === 
			JSON.stringify('1')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{.1e2}}`).getAST()) === 
			JSON.stringify('10')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{1.1e0}}`).getAST()) === 
			JSON.stringify('1.1')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{1.1e1}}`).getAST()) === 
			JSON.stringify('11')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{1.1e2}}`).getAST()) === 
			JSON.stringify('110')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{.1E0}}`).getAST()) === 
			JSON.stringify('0.1')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{.1E1}}`).getAST()) === 
			JSON.stringify('1')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{.1E2}}`).getAST()) === 
			JSON.stringify('10')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{1.1E0}}`).getAST()) === 
			JSON.stringify('1.1')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{1.1E1}}`).getAST()) === 
			JSON.stringify('11')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{1.1E2}}`).getAST()) === 
			JSON.stringify('110')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{.1e+0}}`).getAST()) === 
			JSON.stringify('0.1')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{.1e+1}}`).getAST()) === 
			JSON.stringify('1')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{.1e+2}}`).getAST()) === 
			JSON.stringify('10')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{1.1e+0}}`).getAST()) === 
			JSON.stringify('1.1')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{1.1e+1}}`).getAST()) === 
			JSON.stringify('11')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{1.1e+2}}`).getAST()) === 
			JSON.stringify('110')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{.1E+0}}`).getAST()) === 
			JSON.stringify('0.1')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{.1E+1}}`).getAST()) === 
			JSON.stringify('1')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{.1E+2}}`).getAST()) === 
			JSON.stringify('10')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{1.1E+0}}`).getAST()) === 
			JSON.stringify('1.1')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{1.1E+1}}`).getAST()) === 
			JSON.stringify('11')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{1.1E+2}}`).getAST()) === 
			JSON.stringify('110')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{110e-1}}`).getAST()) === 
			JSON.stringify('11')
		);
	},

	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{110E-2}}`).getAST()) === 
			JSON.stringify('1.1')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{110e-3}}`).getAST()) === 
			JSON.stringify('0.11')
		);
	}
];
