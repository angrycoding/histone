var RTTI = require('../RTTI'),
	BasePrototype = RTTI.$Base.prototype,
	UndefinedPrototype = RTTI.$Undefined.prototype;

RTTI.$register(BasePrototype, 'isUndefined', false);
RTTI.$register(UndefinedPrototype, 'isUndefined', true);