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


if (!Constants.EXPERIMENTAL) {

	RTTI.$register(BasePrototype, 'getMethod', (self, args, scope) => {
		var member = args.shift();
		if (isValidMemberName(member) && RTTI.$hasMember(self, member)) {
			return new HistoneMacro([], function(args) {
				return [Constants.AST_CALL, member].concat(args, self);
			}, scope);
		}
	});

}

else {

	RTTI.$register(BasePrototype, 'getMethod', (self, args, scope) => {
		var member = args[0];
		if (isValidMemberName(member) && RTTI.$hasMember(self, member)) {
			return new HistoneMacro([], [Constants.AST_APPLY, self, member, [
				Constants.AST_CALL, [Constants.AST_REF, 0, 0], Constants.RTTI_M_GET, 'arguments'
			]], scope);
		}
	});

	RTTI.$register(BasePrototype, Constants.RTTI_M_UNEVAL, [Constants.AST_UNDEFINED], Constants.RTTI_R_JS);




	RTTI.$register(BasePrototype, 'uneval', (self, args) => {

		var vars = [], topLevel = {}, serialize = function(value, level) {

			value = RTTI.$callRaw(value, Constants.RTTI_M_UNEVAL, args, serialize);

			if (
				level === topLevel ||
				!Utils.$isArray(value) ||
				value[0] === Constants.AST_UNDEFINED ||
				value[0] === Constants.AST_GLOBAL
			) return value;


			var hash = JSON.stringify(value),
				index = vars.indexOf(hash);

			if (index === -1) {
				index = vars.length;
				vars.push(hash);
			}

			return [Constants.AST_REF, level || 0, index];

		};


		self = serialize(self, topLevel);

		if (vars.length) {

			self = [[Constants.AST_RETURN, self]];
			while (vars.length) self.unshift([
				Constants.AST_VAR,
				JSON.parse(vars.pop()),
				vars.length
			]);
			self.unshift(Constants.AST_NODES);

		}

		else if (!Utils.$isArray(self)) {
			self = [Constants.AST_RETURN, self];
		}

		return JSON.stringify(self);


	});

}