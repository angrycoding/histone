var RTTI = require('../RTTI'),
	Constants = require('../Constants'),
	BasePrototype = RTTI.$Base.prototype,
	NullPrototype = RTTI.$Null.prototype;

RTTI.$register(BasePrototype, 'isNull', false);
RTTI.$register(NullPrototype, 'isNull', true);
RTTI.$register(NullPrototype, 'toBoolean', false);
RTTI.$register(NullPrototype, 'toString', 'null');
RTTI.$register(NullPrototype, 'toJSON', 'null');