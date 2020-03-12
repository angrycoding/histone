var Utils = require('./Utils'),
	Constants = require('./Constants'),
	AST_UNDEFINED = Constants.AST_UNDEFINED,
	TPL_AST_REGEXP = /^\s*\[\s*[0-9]+.*\]\s*$/,
	Parser = Constants.HAS_PARSER && require('./parser/Parser');

module.exports = function(template, baseURI) {
	if (Utils.$isString(template)) {
		if (TPL_AST_REGEXP.test(template)) try {
			return JSON.parse(template);
		} catch (exception) {}
		if (Parser) return Parser(template, baseURI);
	}
	return (Utils.$isArray(template) ? template : [AST_UNDEFINED]);
};