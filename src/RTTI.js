var Utils = require('./Utils'),
	ES5Map = require('./ES5Map'),
	Constants = require('./Constants'),
	HistoneBase = require('./classes/Base'),
	HistoneUndefined = require('./classes/Undefined'),
	HistoneNull = require('./classes/Null'),
	HistoneMacro = require('./classes/Macro'),
	HistoneArray = require('./classes/Array'),
	HistoneGlobal = require('./classes/Global'),
	HistoneDate = require('./classes/Date'),
	RTTI_R = Constants.RTTI_R,
	RTTI_R_JS = Constants.RTTI_R_JS,
	RTTI_R_SELF = Constants.RTTI_R_SELF,
	PROCESSOR = Constants.PROCESSOR;

var registry = new ES5Map();
registry.set(HistoneBase.prototype, {});
registry.set(HistoneUndefined.prototype, {});
registry.set(HistoneNull.prototype, {});
registry.set(Boolean.prototype, {});
registry.set(Number.prototype, {});
registry.set(String.prototype, {});
registry.set(RegExp.prototype, {});
registry.set(HistoneMacro.prototype, {});
registry.set(HistoneArray.prototype, {});
registry.set(HistoneDate.prototype, {});
registry.set(HistoneGlobal.prototype, {});


function getArgumentOrder(argument) {
	return (
		argument instanceof RTTI_R ? 1 :
		argument instanceof PROCESSOR ? 2 :
		argument instanceof Function ? 3 :
		4
	);
}

function aSorter(a, b) {
	return getArgumentOrder(a) - getArgumentOrder(b);
}

function isValidState(state) {
	return (Utils.$isNumber(state) && state >= 0);
}

function getPrototypeOf(value) {
	switch (typeof value) {
		case 'boolean': return Boolean.prototype;
		case 'number': return (
			!isFinite(value) ?
			HistoneUndefined.prototype :
			Number.prototype
		);
		case 'string': return String.prototype;
		default: return Object.getPrototypeOf(value);
	}
}

function getType(value) {
	return (
		value === null ?
		HistoneNull.prototype :
		typeof value === 'undefined' ?
		HistoneUndefined.prototype :
		getPrototypeOf(value)
	);
}

function getMember(value, member, bool, type) {

	var members, type;

	if (Utils.$isArray(member)) {
		type = member[0];
		member = member[1];
	} else type = getType(value);

	if (!registry.has(type))
		type = HistoneUndefined.prototype;

	for (;;) {
		members = registry.get(type);
		if (members.hasOwnProperty(member))
			return (bool ? true : members[member]);
		if (type === HistoneBase.prototype)
			return (bool ? false : [Constants.RTTI_V_CLEAN]);
		if (!registry.has(type = getPrototypeOf(type)))
			type = HistoneBase.prototype;
	}
}



// calls method, returns result as is
function callRaw(value, method, args, scope, ret) {

	var member = getMember(value = toHistone(value), method),
		state = member[0],
		needJSArgs = member[2],
		member = member[1];

	if (!Utils.$isFunction(member)) {
		if (member === RTTI_R_SELF) member = value;
		return (ret ? ret(member, state) : member);
	}

	if (arguments.length < 3) {
		args = [];
	}

	else if (!Utils.$isArray(args)) {
		args = [needJSArgs ? callRaw(args, Constants.RTTI_M_TOJS) : toHistone(args)];
	}

	else if (args.length) {
		args = [].concat(args);
		for (var c = 0; c < args.length; c++) args[c] = (
			needJSArgs ?
			callRaw(args[c], Constants.RTTI_M_TOJS) :
			toHistone(args[c])
		);
	}


	if (!ret) {
		return member(value, args, scope);
	}

	else if (member.length < 4) {
		ret(member(value, args, scope), state);
	}

	else member(value, args, scope, function(result, rState) {
		if (!isValidState(rState)) rState = state;
		ret(result, rState);
	});
}


// calls method, returns result as Histone
function callMember(value, method) {


	var args = Array.prototype.slice.call(arguments, 2).sort(aSorter),
		needJSResult = (args[0] instanceof RTTI_R ? args.shift() === RTTI_R_JS : false),
		scope = (args[0] instanceof PROCESSOR ? args.shift() : undefined),
		ret = (args[0] instanceof Function ? args.shift() : undefined);

	if (args.length === 1 && !Utils.$isArray(args = args[0])) args = [args];


	if (!ret) {
		var result = callRaw(value, method, args, scope);
		if (!needJSResult) result = toHistone(result);
		else result = callRaw(result, Constants.RTTI_M_TOJS);
		return result;
	}

	else callRaw(value, method, args, scope, function(result, state) {
		if (!needJSResult) result = toHistone(result);
		else result = callRaw(result, Constants.RTTI_M_TOJS);
		ret(result, state);
	});

}

function register(type, methodName, value, state, needJSArgs) {
	if (!(type instanceof Object)) return false;
	if (registry.has(type)) type = registry.get(type);
	else registry.set(type, type = {});
	if (state instanceof RTTI_R) state = [needJSArgs, needJSArgs = state][0];


	if (value !== RTTI_R_SELF && !Utils.$isFunction(value) && !needJSArgs)
		value = toHistone(value);


	if (!isValidState(state)) state = Constants.RTTI_V_CLEAN;
	return (type[String(methodName)] = [state, value, needJSArgs === RTTI_R_JS], true);
}

function unregister(type, methodName) {
	if (!registry.has(type)) return false;
	var members = registry.get(type);
	if (!members.hasOwnProperty(methodName = String(methodName))) return false;
	delete members[methodName];
	if (!Object.keys(members).length) registry.delete(type);
	return true;
}

function toHistone(value) {

	if (typeof value === 'number' && !isFinite(value))
		value = undefined;

	var type = getType(value);
	if (registry.has(type)) return value;

	if (value instanceof Date) return new HistoneDate(value);


	var key, result = new HistoneArray();



	if (Utils.$isArray(value)) {
		for (key = 0; key < value.length; key++) {
			result.set(toHistone(value[key]));
		}
	}


	else for (key in value) {
		if (!value.hasOwnProperty(key)) continue;
		result.set(toHistone(value[key]), key);
	}
	return result;
}

module.exports = {

	$isValidState: isValidState,
	$register: register,
	$unregister: unregister,
	$toHistone: toHistone,
	$toJSON: (value) => callRaw(value, 'toJSON'),
	$toBoolean: (value) => callRaw(value, 'toBoolean'),
	$toString: (value) => callRaw(value, 'toString'),
	$hasMember: (value, member) => getMember(value, member, true),
	$toJavaScript: (value) => callRaw(value, Constants.RTTI_M_TOJS),
	$toNumber: (value, fallback) => {
		value = callRaw(value, 'toNumber');
		return (Utils.$isNumber(value) ? value : fallback);
	},


	$call: callMember,
	$callRaw: callRaw,
	$global: new HistoneGlobal,


	$Base: HistoneBase,
	$Undefined: HistoneUndefined,
	$Null: HistoneNull,
	$Boolean: Boolean,
	$Number: Number,
	$String: String,
	$RegExp: RegExp,
	$Macro: HistoneMacro,
	$Array: HistoneArray,
	$Date: HistoneDate,
	$Global: HistoneGlobal,

	// $toAST: toAST,

	$toInt: (value, min, max) => {
		if (Utils.$isInteger(value = callRaw(value, 'toNumber'))) {
			if (Utils.$isNumber(min) && value < min) return;
			if (Utils.$isNumber(max) && value > max) return;
			return value;
		}
	}

};