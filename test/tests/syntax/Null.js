module.exports = [

	'{{return null = null}}',
	'{{return null->isNull}}',
	'{{return !null->toBoolean}}',
	'{{return null->toString = "null"}}',
	'{{return null->toJSON = "null"}}',
	'{{return [null: 10].null = 10}}',
	'{{return "x"->null->isUndefined}}',

	(Histone, ret) => {
		try { Histone(`{{var null = 10}}`) }
		catch (e) { ret(true); }
	}

];