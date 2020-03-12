var i18n = require('../i18n'),
	RTTI = require('../RTTI'),
	Utils = require('../Utils'),
	Parser = require('../Parser'),
	Network = require('../Network'),
	Processor = require('../Processor'),
	Constants = require('../Constants'),
	HistoneArray = RTTI.$Array,
	HistoneMacro = RTTI.$Macro,
	GlobalPrototype = RTTI.$Global.prototype;

function getUniqueId() {
	return ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = (c === 'x' ? r : r & 0x3 | 0x8);
		return v.toString(16);
	});
}

function getRand(min, max) {
	min = RTTI.$toInt(min), max = RTTI.$toInt(max);
	if (min === undefined) min = 0;
	if (max === undefined) max = Math.pow(2, 32) - 1;
	if (min > max) { min = [max, max = min][0]; }
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

RTTI.$register(GlobalPrototype, 'getBaseURI', function(self, args, scope) {
	if (scope instanceof Processor) return scope.baseURI;
});

RTTI.$register(GlobalPrototype, 'resolveURI', function(self, args, scope) {
	var relURI = args[0], baseURI = (
		args.length > 1 ? args[1] :
		scope instanceof Processor && scope.baseURI
	);
	if (Utils.$isString(relURI) && Utils.$isString(baseURI) &&
		Utils.$isString(relURI = Utils.$resolveURI(relURI, baseURI))) {
		return relURI;
	}
});

RTTI.$register(GlobalPrototype, 'getDaysInMonth', function(self, args) {
	var year = RTTI.$toInt(args[0]), month = RTTI.$toInt(args[1], 1, 12);
	if (year !== undefined && month !== undefined) {
		return Utils.$getDaysInMonth(year, month);
	}
});

RTTI.$register(GlobalPrototype, 'getDayOfWeek', function(self, args) {
	var year = RTTI.$toInt(args[0]),
		month = RTTI.$toInt(args[1], 1, 12),
		day = RTTI.$toInt(args[2], 1, 31);
	if (year !== undefined && month !== undefined && day !== undefined) {
		var date = new Date([('0000' + year).slice(-4), ('00' + month).slice(-2), ('00' + day).slice(-2)].join('-'))
		if (date.getFullYear() === year &&
			date.getMonth() === month - 1 &&
			date.getDate() === day) {
			return (date.getDay() || 7);
		}
	}
});

if (Constants.LANGUAGE) {
	RTTI.$register(GlobalPrototype, 'getWeekDayNameShort', function(self, args) {
		var day = RTTI.$toInt(args[0], 1, 7);
		return day && i18n(Constants.WEEK_DAYS, day - 1, 0);
	}, Constants.RTTI_V_DIRTY);

	RTTI.$register(GlobalPrototype, 'getWeekDayNameLong', function(self, args) {
		var day = RTTI.$toInt(args[0], 1, 7);
		return day && i18n(Constants.WEEK_DAYS, day - 1, 1);
	}, Constants.RTTI_V_DIRTY);

	RTTI.$register(GlobalPrototype, 'getMonthNameShort', function(self, args) {
		var month = RTTI.$toInt(args[0], 1, 12);
		return month && i18n(Constants.MONTH_NAMES, month - 1, 0);
	}, Constants.RTTI_V_DIRTY);

	RTTI.$register(GlobalPrototype, 'getMonthNameLong', function(self, args) {
		var month = RTTI.$toInt(args[0], 1, 12), form = RTTI.$toBoolean(args[1]);
		return month && i18n(Constants.MONTH_NAMES, month - 1, form ? 2 : 1);
	}, Constants.RTTI_V_DIRTY);
}

else {
	RTTI.$register(GlobalPrototype, 'getWeekDayNameShort', undefined);
	RTTI.$register(GlobalPrototype, 'getWeekDayNameLong', undefined);
	RTTI.$register(GlobalPrototype, 'getMonthNameShort', undefined);
	RTTI.$register(GlobalPrototype, 'getMonthNameLong', undefined);
}

RTTI.$register(GlobalPrototype, 'getMin', function(self, args) {
	var oValue, nValue, result = [];
	while (args.length) {
		oValue = args.shift(), nValue = RTTI.$toNumber(oValue);
		if (nValue !== undefined) {
			if (!result.length || nValue < result[0]) result = [nValue, oValue];
		} else if (oValue instanceof HistoneArray) {
			Array.prototype.push.apply(args, oValue.getValues());
		}
	}
	return result[1];
});

RTTI.$register(GlobalPrototype, 'getMax', function(self, args) {
	var oValue, nValue, result = [];
	while (args.length) {
		oValue = args.shift(), nValue = RTTI.$toNumber(oValue);
		if (nValue !== undefined) {
			if (!result.length || nValue > result[0]) result = [nValue, oValue];
		} else if (oValue instanceof HistoneArray) {
			Array.prototype.push.apply(args, oValue.getValues());
		}
	}
	return result[1];
});

RTTI.$register(GlobalPrototype, 'range', function(self, args) {
	var to, step = 1, result = [],
		from = RTTI.$toInt(args[0]);
	if (from !== undefined) {
		if (args.length > 1) {
			to = RTTI.$toInt(args[1]);
			step = RTTI.$toInt(args[2]);
			if (step === undefined || step < 1) step = 1;
		}
		else if (from < 0) { to = 0; from = from + 1 }
		else if (from > 0) { to = from - 1; from = 0 };
		if (to !== undefined) {
			if (from < to) while (from <= to) result.push(from), from += step;
			else while (from >= to) result.push(from), from -= step;
		}
	}
	return result;
});

RTTI.$register(GlobalPrototype, 'getUniqueId', getUniqueId, Constants.RTTI_V_DIRTY);
RTTI.$register(GlobalPrototype, 'getRand', (self, args) => getRand(args[0], args[1]), Constants.RTTI_V_DIRTY);
RTTI.$register(GlobalPrototype, 'loadText', (self, args, scope, ret) => Network.$loadText(args[0], ret, args[1], scope));
RTTI.$register(GlobalPrototype, 'loadJSON', (self, args, scope, ret) => Network.$loadJSON(args[0], ret, args[1], scope));
RTTI.$register(GlobalPrototype, 'require', (self, args, scope, ret) => Network.$require(args[0], ret, args[1], scope));
RTTI.$register(GlobalPrototype, 'getSafeUniqueId', getUniqueId);
RTTI.$register(GlobalPrototype, 'getSafeRand', (self, args) => getRand(args[0], args[1]));
RTTI.$register(GlobalPrototype, 'wait', function(self, args, scope, ret) {

	var delay = args.shift(), callback = args.shift();

	if (!(callback instanceof HistoneMacro)) {
		callback = new HistoneMacro([], callback, scope);
	}

	if (delay instanceof HistoneMacro) {
		var resultState = Constants.RTTI_V_CLEAN;
		Utils.$for(function(iterator) {
			delay.call([], scope, function(value, state) {
				resultState |= state;
				if (!RTTI.$toBoolean(value)) iterator();
				else callback.call(args, scope, function(value, state) {
					ret(value, resultState | state);
				}, {
					'condition': value,
					'iteration': iterator.iteration
				});
			});
		});
	}

	else {

		delay = RTTI.$toInt(delay, 0);

		if (delay === undefined || delay < 0)
			callback.call(args, scope, ret);

		else setTimeout(function() {
			callback.call(args, scope, ret);
		}, delay);

	}
});