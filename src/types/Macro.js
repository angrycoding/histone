var RTTI = require('../RTTI'),
	Utils = require('../Utils'),
	Constants = require('../Constants'),
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

if (Constants.EXPERIMENTAL) {

	var knownVar = {};


	function doCollect(scope, pNode, pIndex, serialize, level) {

		var node = pNode[pIndex];

		if (Utils.$isArray(node)) switch (node[0]) {

			case Constants.AST_THIS:
				pNode[pIndex] = serialize(scope.thisObj, level);
				break;

			case Constants.AST_WHILE:
				if (node.length > 2) doCollect(scope, node, 2, serialize, level);
				scope = scope.extend();
				scope.putVar(knownVar, 0, true);
				doCollect(scope, node, 1, scope, serialize, level + 1);
				break;

			case Constants.AST_IF:
				for (var c = 1; c < node.length; c++) if (c % 2)
					doCollect(scope.extend(), node, c, serialize, level + 1);
				else doCollect(scope, node, c, serialize, level);
				break;

			case Constants.AST_VAR:
				scope.putVar(knownVar, node[2], true);
				doCollect(scope, node, 1, serialize, level);
				break;

			case Constants.AST_NODES:
				scope = scope.extend();
				for (var c = 1; c < node.length; c++)
					doCollect(scope, node, c, serialize, level + 1);
				break;

			case Constants.AST_MACRO:
				scope = scope.extend();
				for (var index = 0; index <= (node[3] || 0); index++)
					scope.putVar(knownVar, index, true);
				node[1] = 0;
				doCollect(scope, node, 2, serialize, level + 1);
				break;

			case Constants.AST_FOR:
				doCollect(scope, node, 4, serialize, level);
				scope = scope.extend();
				scope.putVar(knownVar, 0, true);
				if (node[1]) scope.putVar(knownVar, node[1], true);
				if (node[2]) scope.putVar(knownVar, node[2], true);
				doCollect(scope, node, 3, serialize, level + 1);
				break;

			case Constants.AST_REF:

				scope.processRef(node, scope, function(value, state) {
					if (value !== knownVar) {

						// console.info(value, state)

						pNode[pIndex] = serialize(value, level);

					}
				})


				break;


			default: for (var c = 1; c < node.length; c++) {
				doCollect(scope, node, c, serialize, level);
			}


		}

		else {
			pNode[pIndex] = serialize(node, level);
		}

	}

	function arrayClone(value) {
		if (Utils.$isArray(value)) {
			value = value.slice(0);
			for (var i = 0; i < value.length; i++)
				value[i] = arrayClone(value[i]);
		}
		return value;
	}

	RTTI.$register(MacroPrototype, Constants.RTTI_M_UNEVAL, function(self, args, serialize) {

		var args = self.args,
			params = self.params,
			arity = params.length,
			result = [Constants.AST_MACRO, 0, arrayClone(self.body)];

		if (arity) result.push(arity);

		for (var param, index = 0; index < arity; index++) {
			if (!Utils.$isUndefined(param = params[index])) {
				result.push(index, serialize(param));
			}
		}

		doCollect(self.scope, [result], 0, serialize, 0);


		if (args.length) {
			result = [result];
			for (var index = 0; index < args.length; index++)
				result.unshift(serialize(args[index]));
			result.unshift(Constants.AST_CALL, 'bind');
		}


		return result;

	});

}




