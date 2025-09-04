export default [

	(Histone, ret) => ret(typeof Histone === 'function'),
	(Histone, ret) => ret(Histone.length === 2),
	(Histone, ret) => ret(typeof Histone.version === 'string'),
	(Histone, ret) => ret(typeof Histone.R_JS === 'object'),
	(Histone, ret) => ret(typeof Histone.R_HISTONE === 'object'),
	(Histone, ret) => ret(typeof Histone.R_STRING === 'object'),
	(Histone, ret) => ret(typeof Histone.R_SELF === 'object'),
	(Histone, ret) => ret(typeof Histone.M_GET === 'number'),
	(Histone, ret) => ret(typeof Histone.M_CALL === 'number'),
	(Histone, ret) => ret(typeof Histone.M_TOJS === 'number'),
	(Histone, ret) => ret(typeof Histone.V_CLEAN === 'number'),
	(Histone, ret) => ret(typeof Histone.V_DIRTY === 'number'),
	(Histone, ret) => ret(typeof Histone.register === 'function'),
	(Histone, ret) => ret(typeof Histone.unregister === 'function'),
	(Histone, ret) => ret(typeof Histone.invoke === 'function'),
	(Histone, ret) => ret(typeof Histone.setLanguage === 'function'),
	(Histone, ret) => ret(typeof Histone.setCache === 'function'),
	(Histone, ret) => ret(typeof Histone.clearCache === 'function'),
	(Histone, ret) => ret(typeof Histone.loadText === 'function'),
	(Histone, ret) => ret(typeof Histone.loadJSON === 'function'),
	(Histone, ret) => ret(typeof Histone.require === 'function'),
	(Histone, ret) => ret(typeof Histone.setResourceLoader === 'function'),
	(Histone, ret) => ret(typeof Histone.Base === 'function'),
	(Histone, ret) => ret(typeof Histone.Undefined === 'function'),
	(Histone, ret) => ret(typeof Histone.Null === 'function'),
	(Histone, ret) => ret(typeof Histone.Boolean === 'function'),
	(Histone, ret) => ret(typeof Histone.Number === 'function'),
	(Histone, ret) => ret(typeof Histone.String === 'function'),
	(Histone, ret) => ret(typeof Histone.RegExp === 'function'),
	(Histone, ret) => ret(typeof Histone.Macro === 'function'),
	(Histone, ret) => ret(typeof Histone.Array === 'function'),
	(Histone, ret) => ret(typeof Histone.Date === 'function'),
	(Histone, ret) => ret(typeof Histone.Global === 'function'),

	(Histone, ret) => ret(Histone.Boolean === Boolean),
	(Histone, ret) => ret(Histone.Number === Number),
	(Histone, ret) => ret(Histone.String === String),
	(Histone, ret) => ret(Histone.RegExp === RegExp),
	(Histone, ret) => ret(Histone.global instanceof Histone.Global),
	(Histone, ret) => ret(Histone.Array.prototype.isPrototypeOf(Histone.Date.prototype)),
	(Histone, ret) => ret(Histone.Array.prototype.isPrototypeOf(Histone.Global.prototype)),

	(Histone, ret) => ret(typeof Histone.toNumber === 'function'),
	(Histone, ret) => ret(Histone.toNumber.length === 2),

	(Histone, ret) => ret(typeof Histone.toJSON === 'function'),
	(Histone, ret) => ret(Histone.toJSON.length === 1),

	(Histone, ret) => ret(typeof Histone.toHistone === 'function'),
	(Histone, ret) => ret(Histone.toHistone.length === 1),

	(Histone, ret) => ret(typeof Histone.toJavaScript === 'function'),
	(Histone, ret) => ret(Histone.toJavaScript.length === 1),

	(Histone, ret) => ret(typeof Histone.toString === 'function'),
	(Histone, ret) => ret(Histone.toString.length === 1),

	(Histone, ret) => ret(typeof Histone.toBoolean === 'function'),
	(Histone, ret) => ret(Histone.toBoolean.length === 1),


];