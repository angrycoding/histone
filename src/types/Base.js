var RTTI = require('../RTTI'),
	Utils = require('../Utils'),
	Constants = require('../Constants'),
	HistoneMacro = RTTI.$Macro,
	BasePrototype = RTTI.$Base.prototype,
	validMemberName = /^[_$a-zA-Z][_$a-zA-Z0-9]*$/;

function isValidMemberName(name) {
	return (Utils.$isString(name) && validMemberName.test(name));
}

RTTI.$register(BasePrototype, 'toJSON', 'null');
RTTI.$register(BasePrototype, Constants.RTTI_M_TOJS, Constants.RTTI_R_SELF);

RTTI.$register(BasePrototype, 'hasMethod', (self, args) => {
	var member = args[0];
	return (isValidMemberName(member) && RTTI.$hasMember(self, member));
});

RTTI.$register(BasePrototype, 'getMethod', (self, args, scope) => {
	var member = args[0];
	if (isValidMemberName(member) && RTTI.$hasMember(self, member)) {
		return new HistoneMacro([], [Constants.AST_APPLY, self, member, [
			Constants.AST_CALL, [Constants.AST_REF, 0, 0], Constants.RTTI_M_GET, 'arguments'
		]], scope);
	}
});