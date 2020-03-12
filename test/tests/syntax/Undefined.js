module.exports = [

	'{{return blaBla->isUndefined}}',
	'{{return undefined = undefined}}',
	'{{return undefined->isUndefined}}',
	'{{return undefined->toJSON = "null"}}',
	'{{return undefined->toBoolean = false}}',
	'{{return undefined->toBoolean->isBoolean}}',
	'{{return undefined->toString = ""}}',
	'{{return undefined->toString->length = 0}}',
	'{{return undefined->toString->isString}}',
	'{{return [undefined: 10].undefined = 10}}',
	'{{return "x"->undefined->isUndefined}}',
	(Histone, ret) => {
		try { Histone(`{{var undefined = 10}}`) }
		catch (e) { ret(true); }
	}

];