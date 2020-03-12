var RTTI_R = function(){};
var RTTI_R_JS = function(){};
var RTTI_R_HISTONE = function(){};
var RTTI_R_STRING = function(){};
var I18N = {WEEK_DAYS: 1, MONTH_NAMES: 2, DATE_FORMAT: 3};

RTTI_R_JS.prototype = Object.create(RTTI_R.prototype);
RTTI_R_HISTONE.prototype = Object.create(RTTI_R.prototype);
RTTI_R_STRING.prototype = Object.create(RTTI_R.prototype);

module.exports = {

	VERSION: /*{{if true}}*//*{{this.VERSION->toJSON}}*//*{{else}}*/'dev'/*{{/if}}*/,
	EXPERIMENTAL: /*{{if true}}*//*{{this.EXPERIMENTAL->toJSON}}*//*{{else}}*/true/*{{/if}}*/,
	HAS_PARSER: /*{{if true}}*//*{{this.HAS_PARSER->toJSON}}*//*{{else}}*/true/*{{/if}}*/,
	LANGUAGE: /*{{if true}}*//*{{this.LANGUAGE->toJSON}}*//*{{else}}*/'ru'/*{{/if}}*/,
	LANGUAGES: /*{{if true}}*//*{{this.LANGUAGES->toJSON}}*//*{{else}}*/{
		ru: require('../i18n/ru')(I18N),
		en: require('../i18n/en')(I18N)
	}/*{{/if}}*/,

	WEEK_DAYS: I18N.WEEK_DAYS,
	MONTH_NAMES: I18N.MONTH_NAMES,
	DATE_FORMAT: I18N.DATE_FORMAT,

	AST_UNDEFINED: 0,
	AST_ARRAY: 1,
	AST_REGEXP: 2,
	AST_THIS: 3,
	AST_GLOBAL: 4,
	AST_NOT: 5,
	AST_AND: 6,
	AST_OR: 7,
	AST_TERNARY: 8,
	AST_ADD: 9,
	AST_SUB: 10,
	AST_MUL: 11,
	AST_DIV: 12,
	AST_MOD: 13,
	AST_USUB: 14,
	AST_LT: 15,
	AST_GT: 16,
	AST_LE: 17,
	AST_GE: 18,
	AST_EQ: 19,
	AST_NEQ: 20,
	AST_REF: 21,
	AST_CALL: 22,
	AST_VAR: 23,
	AST_IF: 24,
	AST_FOR: 25,
	AST_MACRO: 26,
	AST_RETURN: 27,
	AST_NODES: 28,
	AST_NODELIST: 29,
	AST_BOR: 30,
	AST_BXOR: 31,
	AST_BAND: 32,
	AST_SUPPRESS: 33,
	AST_BLS: 34,
	AST_BRS: 35,
	AST_BNOT: 36,
	AST_BREAK: 37,
	AST_CONTINUE: 38,
	AST_WHILE: 39,
	AST_APPLY: 40,
	AST_TREE: 41,

	RTTI_M_GET: 0,
	RTTI_M_CALL: 1,
	RTTI_M_TOJS: 2,
	RTTI_M_UNEVAL: 3,

	RTTI_V_CLEAN: 0,
	RTTI_V_DIRTY: 1,
	RTTI_V_NORET: 2,

	RTTI_R: RTTI_R,
	RTTI_R_JS: new RTTI_R_JS,
	RTTI_R_HISTONE: new RTTI_R_HISTONE,
	RTTI_R_STRING: new RTTI_R_STRING,
	RTTI_R_SELF: new (function(){}),
	PROCESSOR: (function(){})

};