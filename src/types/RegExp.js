var RTTI = require('../RTTI'),
	Constants = require('../Constants'),
	BasePrototype = RTTI.$Base.prototype,
	RegExpPrototype = RTTI.$RegExp.prototype;

RTTI.$register(BasePrototype, 'isRegExp', false);
RTTI.$register(RegExpPrototype, 'isRegExp', true);
RTTI.$register(RegExpPrototype, 'toBoolean', true);
RTTI.$register(RegExpPrototype, 'toString', (self) => String(self));
RTTI.$register(RegExpPrototype, 'toJSON', (self) => JSON.stringify(String(self)));
RTTI.$register(RegExpPrototype, 'test', (self, args) => self.test(RTTI.$toString(args[0])));