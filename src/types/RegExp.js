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

if (Constants.EXPERIMENTAL) {
	RTTI.$register(RegExpPrototype, Constants.RTTI_M_UNEVAL, (self) => {
		self = self.toString();
		var result = [Constants.AST_REGEXP, self.split('/')[1]];
		if (self = self.match(/[a-z]+$/)) result.push(self[0]);
		return result;
	});
}