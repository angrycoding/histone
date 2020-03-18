var RTTI = require('./RTTI'),
	Utils = require('./Utils'),
	Constants = require('./Constants'),
	HistoneDate = RTTI.$Date,
	HistoneArray = RTTI.$Array,
	HistoneMacro = RTTI.$Macro;

function BreakOrContinue(level, toContinue) {
	this.result = '';
	this.level = level;
	this.toContinue = toContinue;
}

BreakOrContinue.prototype.extend = function(value) {
	this.result = value + this.result;
	return this;
};

function processArray(node, scope, ret, nodeType) {
	
	var processItem,
		resultState = Constants.RTTI_V_CLEAN,
		isArray = (nodeType === Constants.AST_ARRAY),
		result = new HistoneArray();

	Utils.$for(function(next, iteration) {
		if (!next) return ret(result, resultState);
		processNode(node[iteration], scope, processItem || (
			processItem = function(value, state) {
				resultState |= state;
				if (state & Constants.RTTI_V_NORET) return ret(value, resultState);
				if (isArray) result.set(value);
				else result.set(value, node[next.iteration + 1]);
				next();
			}
		));
	}, 1, node.length - 1, isArray ? 1 : 2);
}

function processLogical(node, scope, ret) {
	processNode(node[1], scope, function(result, resultState) {
		if (resultState & Constants.RTTI_V_NORET)
			return ret(result, resultState);
		var bResult = RTTI.$toBoolean(result);
		switch (node[0]) {
			case Constants.AST_NOT: ret(!bResult, resultState); break;
			case Constants.AST_AND: bResult = !bResult;
			default: if (bResult) ret(result, resultState);
			else processNode(node[2], scope, function(value, state) {
				ret(value, resultState | state);
			});
		}
	});
}

function processTernary(node, scope, ret) {
	processNode(node[1], scope, function(value, resultState) {
		if (resultState & Constants.RTTI_V_NORET) return ret(value, resultState);
		RTTI.$toBoolean(value) ?
			processNode(node[2], scope, function(value, valueState) {
				ret(value, resultState | valueState);
			}) :
		node.length > 3 ?
			processNode(node[3], scope, function(value, valueState) {
				ret(value, resultState | valueState);
			}) :
		ret(undefined, resultState);
	});
}

function processUnaryMinus(node, scope, ret) {
	processNode(node[1], scope, function(value, valueState) {
		if (valueState & Constants.RTTI_V_NORET) return ret(value, valueState);
		value = RTTI.$toNumber(value);
		ret(value && -value, valueState);
	});
}

function processBitwise(node, scope, ret) {
	processNode(node[1], scope, function(left, leftState) {
		if (leftState & Constants.RTTI_V_NORET) return ret(left, leftState);
		left = (Utils.$isNumber(left = RTTI.$toNumber(left)) ? left | 0 : 0);
		if (node[0] === Constants.AST_BNOT) ret(~left, leftState);
		else processNode(node[2], scope, function(right, rightState) {
			leftState |= rightState;
			if (rightState & Constants.RTTI_V_NORET) return ret(right, leftState);
			right = (Utils.$isNumber(right = RTTI.$toNumber(right)) ? right | 0 : 0);
			switch (node[0]) {
				case Constants.AST_BOR: left |= right; break;
				case Constants.AST_BXOR: left ^= right; break;
				case Constants.AST_BAND: left &= right; break;
				case Constants.AST_BLS: left <<= right; break;
				case Constants.AST_BRS: left >>= right; break;
			}
			ret(left, leftState);
		});
	});
}

function processComparison(node, scope, ret) {
	processNode(node[1], scope, function(left, leftState) {
		if (leftState & Constants.RTTI_V_NORET) return ret(left, leftState);
		processNode(node[2], scope, function(right, rightState) {
			leftState |= rightState;
			if (rightState & Constants.RTTI_V_NORET) return ret(right, leftState);

			// String OP Number
			if (Utils.$isString(left) && Utils.$isNumber(right)) {
				if (Utils.$isString(left = RTTI.$toNumber(left, left))) {
					right = RTTI.$toString(right);
				}
			}

			// Number OP String
			else if (Utils.$isNumber(left) && Utils.$isString(right)) {
				if (Utils.$isString(right = RTTI.$toNumber(right, right))) {
					left = RTTI.$toString(left);
				}
			}

			// Date OP Date
			else if (left instanceof HistoneDate && right instanceof HistoneDate) {
				left = left.toJavaScript().getTime();
				right = right.toJavaScript().getTime();
			}

			if (!Utils.$isNumber(left) || !Utils.$isNumber(right)) {


				if (!Utils.$isString(left) || !Utils.$isString(right)) {
					left = RTTI.$toBoolean(left);
					right = RTTI.$toBoolean(right);
				}

				else if ([Constants.AST_EQ, Constants.AST_NEQ].indexOf(node[0]) === -1) {
					left = left.length;
					right = right.length;
				}


			}



			switch (node[0]) {
				case Constants.AST_EQ: left = left === right; break;
				case Constants.AST_NEQ: left = left !== right; break;
				case Constants.AST_LT: left = left < right; break;
				case Constants.AST_GT: left = left > right; break;
				case Constants.AST_LE: left = left <= right; break;
				case Constants.AST_GE: left = left >= right; break;
			}

			ret(left, leftState);
		});
	});
}

function processArithmetical(node, scope, ret) {
	processNode(node[1], scope, function(left, leftState) {
		if (leftState & Constants.RTTI_V_NORET) return ret(left, leftState);
		if ((left = RTTI.$toNumber(left)) === undefined) ret(undefined, leftState);
		else processNode(node[2], scope, function(right, rightState) {
			leftState |= rightState;
			if (rightState & Constants.RTTI_V_NORET) return ret(right, leftState);
			if ((right = RTTI.$toNumber(right)) === undefined) left = undefined;
			else switch (node[0]) {
				case Constants.AST_SUB: left -= right; break;
				case Constants.AST_MUL: left *= right; break;
				case Constants.AST_DIV: left /= right; break;
				case Constants.AST_MOD: left %= right; break;
			}
			ret(Utils.$isNumber(left) ? left : undefined, leftState);
		});
	});
}

function processAddition(node, scope, ret) {
	processNode(node[1], scope, function(left, leftState) {
		if (leftState & Constants.RTTI_V_NORET) return ret(left, leftState);
		processNode(node[2], scope, function(right, rightState) {
			leftState |= rightState;
			if (rightState & Constants.RTTI_V_NORET) return ret(right, leftState);
			transform: {
				if (!(Utils.$isString(left) || Utils.$isString(right))) {

					if (left instanceof HistoneArray && right instanceof HistoneArray) {
						left = left.concat(right);
						break transform;
					}

					var nLeft = RTTI.$toNumber(left), nRight = RTTI.$toNumber(right);

					if (Utils.$isNumber(nLeft)) {
						left = (Utils.$isNumber(nRight) ? nLeft + nRight : undefined);
						break transform;
					}

					if (Utils.$isNumber(nRight)) {
						left = (Utils.$isNumber(nLeft) ? nLeft + nRight : undefined);
						break transform;
					}

				}

				left = RTTI.$toString(left) + RTTI.$toString(right);

			}
			ret(left, leftState);
		});
	});
}

function processCall(node, scope, ret, apply) {

	var processValue, values = [],
		resultState = Constants.RTTI_V_CLEAN;

	Utils.$for(function(iterator, iteration) {

		if (iterator) processNode(node[iteration], scope, processValue || (
			processValue = function(value, state) {
				resultState |= state;
				if (state & Constants.RTTI_V_NORET) return ret(value, resultState);
				values.push(value);
				iterator();
			}
		));

		// if (apply) args = args[0].getValues();
		else RTTI.$call(values.pop(), node[1], values, function(value, state) {
			ret(value, resultState | state);
		}, scope);

	}, 2, node.length - 1);
}

function processRef(node, scope, ret) {
	var result = node[1];
	result = (result ? scope.parents[result - 1] : scope).variables[node[2]];
	if (!ret) return result[1];
	ret(result[0], result[1]);
}

function processVarSuppress(node, scope, ret) {
	processNode(node[1], scope, function(value, state) {
		if (state & Constants.RTTI_V_NORET) return ret(value, state);
		if (node[0] === Constants.AST_VAR)
			scope.putVar(value, node[2], true, state);
		ret('', state);
	});
}

function processMacro(node, scope, ret) {

	var processParam, params, resultState;

	if (Utils.$isArray(params = node[1])) {
		resultState = Constants.RTTI_V_CLEAN;
		while (params.length) {
			resultState |= processRef(params.shift(), scope);
			if (resultState & Constants.RTTI_V_DIRTY) break;
		}
		node[1] = resultState;
	} else resultState = params;

	params = new Array(node[3] || 0);

	Utils.$for(function(iterator, iteration) {
		iterator ? processNode(node[iteration + 1], scope, processParam || (
			processParam = function(value, valueState) {
				resultState |= valueState;
				if (resultState & Constants.RTTI_V_NORET) return ret(value, resultState);
				params[node[iterator.iteration]] = value;
				iterator();
			}
		)) : ret(new HistoneMacro(params, node[2], scope), resultState);
	}, 4, node.length - 1, 2);
}

function processIf(node, scope, retn, retf, start) {

	var processCondition, last = node.length - 1, resultState = Constants.RTTI_V_CLEAN,
		processBody = function(value, state) { retn(value, resultState | state); },
		processReturn = function(value, state) { retf(value, resultState | state); };

	Utils.$for(function(iterator, iteration) {
		iterator ? (
			iteration === last ?
			processNode(node[iteration], scope.extend(), processBody, processReturn) :
			processNode(node[iteration + 1], scope, processCondition || (
				processCondition = function(value, state) {
					resultState |= state;
					if (resultState & Constants.RTTI_V_NORET) return retf(value, resultState);
					RTTI.$toBoolean(value) ? processNode(
						node[iterator.iteration],
						scope.extend(),
						processBody,
						processReturn
					) : iterator();
				})
			)
		) : retn('', resultState);
	}, start, last, 2);
}

function processNodeList(node, scope, retn, retf) {

	var processBlock, result = '', resultState = Constants.RTTI_V_CLEAN,
		processReturn = function(value, state) { retf(value, resultState | state); };

	Utils.$for(function(iterator, iteration) {
		iterator ? processNode(node[iteration], scope, processBlock || (
			processBlock = function(value, state) {

				resultState |= state;

				if (state & Constants.RTTI_V_NORET) {
					retf(value, resultState);
				}

				else if (value instanceof BreakOrContinue) {
					retn(value.extend(result), resultState);
				}

				else {
					result += RTTI.$toString(value);
					iterator();
				}

			}), processReturn
		) : retn(result, resultState);
	}, 1, node.length - 1);
}

function processWhile(node, scope, retn, retf) {

	var loopScope, processBody, processCondition,
		loopBody = node[1], result = '',
		resultState = Constants.RTTI_V_CLEAN,
		loopCondition = (node.length > 2 ? node[2] : true);

	Utils.$for(function(iterator) {

		processNode(loopCondition, scope, processCondition || (processCondition = function(value, state) {
			resultState |= state;

			if (state & Constants.RTTI_V_NORET) return retf(value, resultState);

			if (RTTI.$toBoolean(value)) {

				loopScope = scope.extend();

				loopScope.putVar({
					'iteration': iterator.iteration,
					'condition': value
				}, 0, false);

				processNode(loopBody, loopScope, processBody || (processBody = function(value, state) {

					resultState |= state;

					if (state & Constants.RTTI_V_NORET) return retf(value, resultState);

					if (!(value instanceof BreakOrContinue)) {
						result += value;
						iterator();
					}

					else if (value.extend(result).level) {
						value.level--;
						retn(value, resultState);
					}

					else if (value.toContinue) {
						iterator();
					}

					else {
						retn(value.result, resultState);
					}

				}), retf);

			} else retn(result, resultState);
		}), retf);

	});
}

function processFor(node, scope, retn, retf) {
	processNode(node[4], scope, function(collection, resultState) {
		if (resultState & Constants.RTTI_V_NORET) return retf(collection, resultState);
		if (collection instanceof HistoneArray && collection.getLength()) {

			var loopScope,
				processBody,
				result = '',
				keyIndex = node[1],
				valIndex = node[2],
				loopBody = node[3];

			collection.forEachAsync(function(next, value, key, index, last) {


				if (next) {

					loopScope = scope.extend();

					loopScope.putVar({
						'key': key,
						'value': value,
						'index': index,
						'last': last
					}, 0, false);

					if (keyIndex) loopScope.putVar(key, keyIndex, true);
					if (valIndex) loopScope.putVar(value, valIndex, true);

					processNode(loopBody, loopScope, processBody || (processBody = function(value, state) {

						resultState |= state;

						if (state & Constants.RTTI_V_NORET) return retf(value, resultState);


						if (!(value instanceof BreakOrContinue)) {
							result += value;
							next();
						}

						else if (value.extend(result).level) {
							value.level--;
							retn(value, resultState);
						}

						else if (value.toContinue) {
							next();
						}

						else {
							retn(value.result, resultState);
						}


					}), retf);

				} else retn(result, resultState);


			});



		} else processIf(node, scope, function(value, state) {
			resultState |= state;
			if (state & Constants.RTTI_V_NORET) return retf(value, resultState);
			retn(value, resultState);
		}, function(value, state) {
			resultState |= state;
			if (state & Constants.RTTI_V_NORET) return retf(value, resultState);
			retf(value, resultState);
		}, 5);
	});
}

function processNode(node, scope, retn, retf) {

	if (Utils.$isArray(node)) switch (node[0]) {

		case Constants.AST_UNDEFINED: retn(undefined, Constants.RTTI_V_CLEAN); break;
		case Constants.AST_THIS: retn(scope.thisObj, Constants.RTTI_V_DIRTY); break;
		case Constants.AST_GLOBAL: retn(RTTI.$global, Constants.RTTI_V_CLEAN); break;
		case Constants.AST_REGEXP: retn(new RegExp(node[1], node[2] || ''), Constants.RTTI_V_CLEAN); break;
		case Constants.AST_TREE: retn(JSON.stringify(node[1]), Constants.RTTI_V_CLEAN); break;

		case Constants.AST_ARRAY:
		case Constants.AST_OBJECT: processArray(node, scope, retn, node[0]); break;
		case Constants.AST_USUB: processUnaryMinus(node, scope, retn); break;
		case Constants.AST_ADD: processAddition(node, scope, retn); break;

		case Constants.AST_CALL:
		case Constants.AST_APPLY:
			processCall(node, scope, retn, node[0] === Constants.AST_APPLY); break;

		case Constants.AST_TERNARY: processTernary(node, scope, retn); break;
		case Constants.AST_MACRO: processMacro(node, scope, retn); break;
		case Constants.AST_REF: processRef(node, scope, retn); break;

		case Constants.AST_OR:
		case Constants.AST_NOT:
		case Constants.AST_AND: processLogical(node, scope, retn); break;

		case Constants.AST_SUB:
		case Constants.AST_MUL:
		case Constants.AST_DIV:
		case Constants.AST_MOD: processArithmetical(node, scope, retn); break;

		case Constants.AST_EQ:
		case Constants.AST_NEQ:
		case Constants.AST_LT:
		case Constants.AST_GT:
		case Constants.AST_LE:
		case Constants.AST_GE: processComparison(node, scope, retn); break;

		case Constants.AST_BLS:
		case Constants.AST_BRS:
		case Constants.AST_BOR:
		case Constants.AST_BXOR:
		case Constants.AST_BAND:
		case Constants.AST_BNOT: processBitwise(node, scope, retn); break;

		case Constants.AST_VAR:
		case Constants.AST_SUPPRESS: processVarSuppress(node, scope, retn); break;

		case Constants.AST_IF: processIf(node, scope, retn, retf || retn, 1); break;
		case Constants.AST_NODELIST: processNodeList(node, scope, retn, retf || retn); break;
		case Constants.AST_NODES: processNodeList(node, scope.extend(), retn, retn); break;
		case Constants.AST_FOR: processFor(node, scope, retn, retf || retn); break;
		case Constants.AST_WHILE: processWhile(node, scope, retn, retf || retn); break;
		case Constants.AST_RETURN: processNode(node[1], scope, retf || retn); break;

		case Constants.AST_BREAK:
		case Constants.AST_CONTINUE:
			retn(new BreakOrContinue(node[1], node[0] === Constants.AST_CONTINUE), Constants.RTTI_V_CLEAN); break;

		default: if (Constants.HAS_PARSER)
			throw('UNKNWON_NODE_TYPE: ' + node[0]);
		else retn(undefined, Constants.RTTI_V_CLEAN);

	} else retn(node, Constants.RTTI_V_CLEAN);
}

function Processor(baseURI, thisObj, shadowObj) {
	this.parents = [];
	this.variables = {};
	this.baseURI = baseURI;
	this.shadowObj = shadowObj;
	this.thisObj = RTTI.$toHistone(thisObj);
}

Processor.prototype = Object.create(Constants.PROCESSOR.prototype);
Processor.prototype.constructor = Processor;

Processor.prototype.putVar = function(value, index, raw, state) {
	if (!raw) value = RTTI.$toHistone(value);
	if (!RTTI.$isValidState(state)) state = Constants.RTTI_V_CLEAN;
	return this.variables[index] = [value, state];
};

Processor.prototype.extend = function(loop) {
	var scope = new Processor(this.baseURI, this.thisObj, this.shadowObj);
	scope.parents = [this].concat(this.parents);
	return scope;
};

Processor.prototype.processRef = processRef;

Processor.prototype.getBaseURI = function() {
	return this.baseURI;
};

Processor.prototype.process = function(node, ret) {
	processNode(node, this, ret);
};

module.exports = Processor;