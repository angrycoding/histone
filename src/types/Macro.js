import RTTI from '../RTTI.js';
import Constants from '../Constants.js';

const
	HistoneArray = RTTI.$Array,
	HistoneMacro = RTTI.$Macro,
	BasePrototype = RTTI.$Base.prototype,
	MacroPrototype = HistoneMacro.prototype;

RTTI.$register(BasePrototype, 'isMacro', false);
RTTI.$register(BasePrototype, 'toMacro', (self, args, scope) => {
	if (self instanceof HistoneMacro) return self;
	return new HistoneMacro([], self, scope);
});

RTTI.$register(MacroPrototype, 'isMacro', true);
RTTI.$register(MacroPrototype, 'toBoolean', true);
RTTI.$register(MacroPrototype, 'toString', self => RTTI.$toString(self.props));
RTTI.$register(MacroPrototype, 'toJSON', self => RTTI.$toJSON(self.props));
RTTI.$register(MacroPrototype, 'bind', (self, args) => self.bind(args));
RTTI.$register(MacroPrototype, Constants.RTTI_M_TOJS, (self) => self.toJavaScript(RTTI.$toJavaScript));

RTTI.$register(MacroPrototype, Constants.RTTI_M_GET, (self, args, scope, ret) => {
	RTTI.$call(self.props, Constants.RTTI_M_GET, args, scope, ret);
});

RTTI.$register(MacroPrototype, Constants.RTTI_M_CALL, (self, args, scope, ret) => {
	self.call(args, scope, ret);
});

RTTI.$register(MacroPrototype, 'extend', (self, args) => {
	var newProps = args[0], oldProps = self.props;
	if (newProps instanceof HistoneArray) {
		if (oldProps instanceof HistoneArray)
			newProps = oldProps.concat(newProps);
		self = self.clone(); self.props = newProps;
	}
	return self;
});

RTTI.$register(MacroPrototype, 'call', (self, args, scope, ret) => {
	var callArgs = [];
	for (var c = 0; c < args.length; c++) {
		var arg = args[c];
		if (arg instanceof HistoneArray)
			Array.prototype.push.apply(callArgs, arg.getValues());
		else callArgs.push(arg);
	}
	self.call(callArgs, scope, ret);
});