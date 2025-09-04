export default [
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`HEY {{*COMMENT*}} HO`).getAST()) === 
			JSON.stringify('HEY  HO')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`HEY {{*COM{{*MENT*}} HO`).getAST()) === 
			JSON.stringify('HEY  HO')
		);
	},
];