module.exports = [
	`{{return []->isRegExp->toString = "false"}}`,
	`{{return undefined->isRegExp->toString = "false"}}`,
	`{{return null->isRegExp->toString = "false"}}`,
	`{{return "null"->isRegExp->toString = "false"}}`,
	`{{return true->isRegExp->toString = "false"}}`,
	`{{return false->isRegExp->toString = "false"}}`,
	`{{return 10->isRegExp->toString = "false"}}`,
	`{{return [1, 2, 3]->isRegExp->toString = "false"}}`,
	`{{return (=>10)->isRegExp->toString = "false"}}`,
	`{{return getDate->isRegExp->toString = "false"}}`,
	`{{return /re/->isRegExp->toString = "true"}}`,
	`{{return (!!/re/)->isBoolean->toString = "true"}}`,
	`{{return (!!/re/)->toString = "true"}}`,
	`{{return /regexp/gim->toString = "/regexp/gim"}}`,
	`{{return /regexp/gim->toJSON = '"/regexp/gim"'}}`,
	`{{return /^[a-z]+$/g->test('foobar')->toString = "true"}}`,
	`{{return /^[a-z]+$/g->test('0foobar')->toString = "false"}}`,
	`{{return /^[a-z]+$/g->test('foobar0')->toString = "false"}}`,
	`{{return /^[a-z]+$/g->test('fooBar')->toString = "false"}}`,
	`{{return /^[a-z]+$/gi->test('fooBar')->toString = "true"}}`,
	`{{return /^football/->test('rugby\nfootball')->toString = "false"}}`,
	`{{return /^football/m->test('rugby\nfootball')->toString = "true"}}`,
	`{{return /foo/->test('Football')->toString = "false"}}`,
	`{{return /foo/i->test('Football')->toString = "true"}}`,

	(Histone, ret) => {
		Histone('{{return /regexp/i}}').render(function(result, state) {
			ret(result instanceof RegExp && state === Histone.V_CLEAN && result.ignoreCase);
		}, Histone.R_JS)
	},

	(Histone, ret) => {
		Histone('{{return /regexp/m}}').render(function(result, state) {
			ret(result instanceof RegExp && state === Histone.V_CLEAN && result.multiline);
		}, Histone.R_JS)
	},

	(Histone, ret) => {
		Histone('{{return /regexp/g}}').render(function(result, state) {
			ret(result instanceof RegExp && state === Histone.V_CLEAN && result.global);
		}, Histone.R_JS)
	},

	(Histone, ret) => {
		Histone('{{return /regexp/}}').render(function(result, state) {
			ret(result instanceof RegExp && state === Histone.V_CLEAN);
		}, Histone.R_JS)
	},

	(Histone, ret) => {
		try { Histone('{{return /regexp/f}}'); }
		catch (exception) { return ret(true); }
		ret(false);
	}

];
