module.exports = [

	'{{return true = true}}',
	'{{return false = false}}',
	'{{return true->isBoolean}}',
	'{{return false->isBoolean}}',
	'{{return true->toBoolean = true}}',
	'{{return true->toBoolean->isBoolean}}',
	'{{return false->toBoolean = false}}',
	'{{return false->toBoolean->isBoolean}}',
	'{{return true->toNumber = 1}}',
	'{{return true->toNumber->isNumber}}',
	'{{return false->toNumber = 0}}',
	'{{return false->toNumber->isNumber}}',
	'{{return true->toString = "true"}}',
	'{{return false->toString = "false"}}',
	'{{return true->toJSON = "true"}}',
	'{{return false->toJSON = "false"}}',
	'{{return [true: 10].true = 10}}',
	'{{return [false: 10].false = 10}}',
	'{{return "x"->true->isUndefined}}',
	'{{return "x"->false->isUndefined}}',

	(Histone, ret) => {
		try { Histone(`{{var true = 10}}`) }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{var false = 10}}`) }
		catch (e) { ret(true); }
	}

];