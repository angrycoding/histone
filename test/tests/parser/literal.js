module.exports = [
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{%HELLO%}}`).getAST()) === 
			JSON.stringify('HELLO')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{%HE{{%LLO%}}`).getAST()) === 
			JSON.stringify('HE{{%LLO')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{%HE{{%L{{%LO%}}`).getAST()) === 
			JSON.stringify('HE{{%L{{%LO')
		);
	},
	(Histone, ret, path, Constants) => {
		ret(
			JSON.stringify(Histone(`{{% {{return "HELLO"}} %}}`).getAST()) === 
			JSON.stringify(' {{return "HELLO"}} ')
		);
	},
];