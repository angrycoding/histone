var Utils = require('../Utils');

function HistoneMacro(params, body, scope) {
	this.params = params;
	this.body = body;
	this.scope = scope;
	this.args = [];
}

HistoneMacro.prototype.toJavaScript = function(toJavaScript) {

	var macro = this;

	return function() {

		var args = Array.prototype.slice.call(arguments), ret = args.pop();



		if (!Utils.$isFunction(ret)) {

			args.push(ret);

			macro.call(args, null, function(result) { ret = result; });
			return toJavaScript(ret);


		}


		else macro.call(args, null, function(result) {
			ret(toJavaScript(result));
		});

	};

};

HistoneMacro.prototype.clone = function() {
	var result = new HistoneMacro();
	for (var key in this) {
		if (this.hasOwnProperty(key)) {
			result[key] = this[key];
		}
	}
	return result;
};

HistoneMacro.prototype.bind = function(args) {
	if (Utils.$isArray(args) && args.length) {
		var macro = this.clone();
		macro.args = args.concat(macro.args);
		return macro;
	}
	return this;
};

HistoneMacro.prototype.call = function(args, scope, ret, mergeSelf) {


	var index,
		macroBody = this.body,
		macroParams = this.params,
		macroScope = this.scope.extend(),
		callArgs = this.args.concat(args),
		selfObj = {
			'callee': this,
			'caller': (scope || macroScope).baseURI,
			'arguments': callArgs
		};

	if (Utils.$isObject(mergeSelf)) {
		for (var key in mergeSelf) {
			if (mergeSelf.hasOwnProperty(key)) {
				selfObj[key] = mergeSelf[key];
			}
		}
	}


	macroScope.putVar(selfObj, 0, false);


	for (index = 0; index < macroParams.length; index++) {
		if (Utils.$isUndefined(callArgs[index]))
			macroScope.putVar(macroParams[index], index + 1, true);
		else macroScope.putVar(callArgs[index], index + 1, false);
	}

	if (Utils.$isFunction(macroBody))
		macroBody = macroBody(callArgs);

	macroScope.process(macroBody, ret);


};


module.exports = HistoneMacro;