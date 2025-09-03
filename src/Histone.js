var i18n = require('./i18n'),
	RTTI = require('./RTTI'),
	Utils = require('./Utils'),
	Parser = require('./Parser'),
	Network = require('./Network'),
	Template = require('./Template'),
	Constants = require('./Constants');

function getBaseURI() {
	try {

		var prepareStackTrace = Error['prepareStackTrace'];
		Error['prepareStackTrace'] = function(_, stack) { return stack; };
		var error = new Error;
		Error['captureStackTrace'](error, arguments.callee);
		var stack = error['stack'];
		Error['prepareStackTrace'] = prepareStackTrace;
		return stack[1]['getFileName']();

	} catch (exception) {

		return (
			typeof window === 'undefined' ?
			'' : window.location.href
		);

	}
}

function Histone(template, baseURI) {
	var callerURI = getBaseURI();
	if (!Utils.$isString(baseURI)) baseURI = callerURI;
	else baseURI = Utils.$resolveURI(baseURI, callerURI);
	if (template instanceof Template) template = template.getAST();
	else template = Parser(template, baseURI);
	return new Template(template, baseURI);
}

Histone.R_JS = Constants.RTTI_R_JS;
Histone.R_HISTONE = Constants.RTTI_R_HISTONE;
Histone.R_STRING = Constants.RTTI_R_STRING;
Histone.R_SELF = Constants.RTTI_R_SELF;

Histone.M_GET = Constants.RTTI_M_GET;
Histone.M_CALL = Constants.RTTI_M_CALL;
Histone.M_TOJS = Constants.RTTI_M_TOJS;

Histone.V_CLEAN = Constants.RTTI_V_CLEAN;
Histone.V_DIRTY = Constants.RTTI_V_DIRTY;
Histone.V_NORET = Constants.RTTI_V_NORET;

Histone.toJSON = RTTI.$toJSON;
Histone.toString = RTTI.$toString;
/** @expose */
Histone.toNumber = RTTI.$toNumber;
/** @expose */
Histone.toBoolean = RTTI.$toBoolean;
/** @expose */
Histone.toJavaScript = RTTI.$toJavaScript;
/** @expose */
Histone.toHistone = RTTI.$toHistone;

/** @expose */
Histone.register = RTTI.$register;
/** @expose */
Histone.unregister = RTTI.$unregister;
/** @expose */
Histone.invoke = RTTI.$call;

/** @expose */
Histone.global = RTTI.$global;
Histone.Base = RTTI.$Base;
Histone.Undefined = RTTI.$Undefined;
Histone.Null = RTTI.$Null;
Histone.Boolean = RTTI.$Boolean;
Histone.Number = RTTI.$Number;
Histone.String = RTTI.$String;
Histone.RegExp = RTTI.$RegExp;
Histone.Macro = RTTI.$Macro;
/** @expose */
Histone.Array = RTTI.$Array;
/** @expose */
Histone.Date = RTTI.$Date;
/** @expose */
Histone.Global = RTTI.$Global;

Histone.version = Constants.VERSION;
Histone.setLanguage = i18n.$setLanguage;
Histone.setCache = Network.$setCache;
Histone.clearCache = Network.$clearCache;

/** @expose */
Histone.loadText = Network.$loadText;
/** @expose */
Histone.loadJSON = Network.$loadJSON;
/** @expose */
Histone.require = Network.$require;
/** @expose */
Histone.setResourceLoader = Network.$setResourceLoader;

require('./types/Base');
require('./types/Undefined');
require('./types/Null');
require('./types/Boolean');
require('./types/Number');
require('./types/String');
require('./types/RegExp');
require('./types/Array');
require('./types/Macro');
require('./types/Date');
require('./types/Global');

module.exports = Histone;