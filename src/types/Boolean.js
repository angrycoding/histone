var RTTI = require('../RTTI'),
	Constants = require('../Constants'),
	BasePrototype = RTTI.$Base.prototype,
	BooleanPrototype = RTTI.$Boolean.prototype;

RTTI.$register(BasePrototype, 'isBoolean', false);
RTTI.$register(BasePrototype, 'toBoolean', false);
RTTI.$register(BooleanPrototype, 'isBoolean', true);
RTTI.$register(BooleanPrototype, 'toBoolean', Constants.RTTI_R_SELF);
RTTI.$register(BooleanPrototype, 'toNumber', (self) => self ? 1 : 0);
RTTI.$register(BooleanPrototype, 'toString', (self) => self ? 'true' : 'false');
RTTI.$register(BooleanPrototype, 'toJSON', (self) => self ? 'true' : 'false');

if (Constants.EXPERIMENTAL) {
	RTTI.$register(BooleanPrototype, Constants.RTTI_M_UNEVAL, Constants.RTTI_R_SELF);
}