import Utils from './Utils.js';
import Constants from './Constants.js';
import ParserImpl from './parser/Parser.js';

var
	AST_UNDEFINED = Constants.AST_UNDEFINED,
	TPL_AST_REGEXP = /^\s*\[\s*[0-9]+.*\]\s*$/,
	Parser = Constants.HAS_PARSER && ParserImpl;

export default function(template, baseURI) {
	if (Utils.$isString(template)) {
		if (TPL_AST_REGEXP.test(template)) try {
			return JSON.parse(template);
		} catch (exception) {}
		if (Parser) return Parser(template, baseURI);
	}
	return (Utils.$isArray(template) ? template : [AST_UNDEFINED]);
};