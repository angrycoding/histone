module.exports = [

	'{{return //->isRegExp}}',
	'{{return /regexp/->isRegExp}}',
	'{{return /regexp/->toBoolean}}',
	'{{return /regexp/->toString = "/regexp/"}}',
	'{{return /regexp/i->toString = "/regexp/i"}}',
	'{{return /regexp/m->toString = "/regexp/m"}}',
	'{{return /regexp/g->toString = "/regexp/g"}}',
	`{{return /regexp/i->toJSON = '"/regexp/i"'}}`,
	`{{return /regexp/m->toJSON = '"/regexp/m"'}}`,
	`{{return /regexp/g->toJSON = '"/regexp/g"'}}`,
	`{{return /[a-z]+/g->test('hello')}}`,
	`{{return /[a-z]+/g->test('10 hello 10')}}`,
	`{{return /^[a-z]+$/g->test('hello')}}`,
	`{{return !/^[a-z]+$/g->test('HELLO')}}`,
	`{{return /^[a-z]+$/gi->test('HELLO')}}`,
	`{{return !/^[a-z]+$/g->test('10')}}`,
	`{{return !/^[a-z]+$/g->test('hello10')}}`,

	(Histone, ret) => {
		try { Histone(`{{/*/}}`) }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{/+/i}}`) }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{/regexp`) }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{/regexp}}`) }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{var f = /regexp}}`) }
		catch (e) { ret(true); }
	}

];