module.exports = [
	'{{return [][0]->isUndefined->toJSON = "true"}}',
	(Histone, ret) => {
		try { Histone('{{[0, 1, 2, 3][]}}') }
		catch (exception) { return ret(true); }
		ret(false);
	},
	'{{return [1,2,3][-10]->isUndefined->toJSON = "true"}}',
	'{{return [1,2,3][0] = 1}}',
	'{{return [1,2,3][-1]->isUndefined->toJSON = "true"}}',
	'{{return [1,2,3][3]->isUndefined->toJSON = "true"}}',
	'{{return ["foo": "bar"]["foo"] = "bar"}}',
	'{{return ["foo": "bar"].foo = "bar"}}',
];
