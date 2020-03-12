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

/** @expose */
Histone.R_JS = Constants.RTTI_R_JS;
/** @expose */
Histone.R_HISTONE = Constants.RTTI_R_HISTONE;
/** @expose */
Histone.R_STRING = Constants.RTTI_R_STRING;
/** @expose */
Histone.R_SELF = Constants.RTTI_R_SELF;

/** @expose */
Histone.M_GET = Constants.RTTI_M_GET;
/** @expose */
Histone.M_CALL = Constants.RTTI_M_CALL;
/** @expose */
Histone.M_TOJS = Constants.RTTI_M_TOJS;

/** @expose */
Histone.V_CLEAN = Constants.RTTI_V_CLEAN;
/** @expose */
Histone.V_DIRTY = Constants.RTTI_V_DIRTY;
/** @expose */
Histone.V_NORET = Constants.RTTI_V_NORET;

/** @expose */
Histone.toJSON = RTTI.$toJSON;
/** @expose */
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
/** @expose */
Histone.Base = RTTI.$Base;
/** @expose */
Histone.Undefined = RTTI.$Undefined;
/** @expose */
Histone.Null = RTTI.$Null;
/** @expose */
Histone.Boolean = RTTI.$Boolean;
/** @expose */
Histone.Number = RTTI.$Number;
/** @expose */
Histone.String = RTTI.$String;
/** @expose */
Histone.RegExp = RTTI.$RegExp;
/** @expose */
Histone.Macro = RTTI.$Macro;
/** @expose */
Histone.Array = RTTI.$Array;
/** @expose */
Histone.Date = RTTI.$Date;
/** @expose */
Histone.Global = RTTI.$Global;

/** @expose */
Histone.version = Constants.VERSION;
/** @expose */
Histone.setLanguage = i18n.$setLanguage;

/** @expose */
Histone.setCache = Network.$setCache;
/** @expose */
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