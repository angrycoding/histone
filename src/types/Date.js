var Constants = require('../Constants'),
	RTTI = require('../RTTI'),
	i18n = require('../i18n'),
	Utils = require('../Utils'),
	HistoneDate = RTTI.$Date,
	HistoneArray = RTTI.$Array,
	BasePrototype = RTTI.$Base.prototype,
	NumberPrototype = RTTI.$Number.prototype,
	StringPrototype = RTTI.$String.prototype,
	GlobalPrototype = RTTI.$Global.prototype,
	ArrayPrototype = HistoneArray.prototype,
	DatePrototype = HistoneDate.prototype;

RTTI.$register(BasePrototype, 'isDate', false);

RTTI.$register(NumberPrototype, 'toDate', (self, args) => {
	var result = new Date(
		Math.trunc ? Math.trunc(self) :
		self < 0 ? Math.ceil(self) :
		Math.floor(self)
	);
	if (isFinite(result.getTime())) return new HistoneDate(result, args[0]);
});

RTTI.$register(StringPrototype, 'toDate', (self, args) => {

	var fString = args.shift();
	if (!Utils.$isString(fString)) return;

	var groups = [];
	var format = new RegExp('^' + fString.replace(/([YMDhms])|.+?/g, function(match, format) {

		if (format) {
			groups.push(format);
			return '(\\d{1,4})';
		}


		return Utils.$escapeRegExp(match);

	}) + '$');


	var match = self.match(format);
	if (match) {

		var result = new HistoneArray();


		while (groups.length) switch (groups.pop()) {
			case 's': result.set(parseInt(match.pop(), 10), 'second'); break;
			case 'm': result.set(parseInt(match.pop(), 10), 'minute'); break;
			case 'h': result.set(parseInt(match.pop(), 10), 'hour'); break;
			case 'Y': result.set(parseInt(match.pop(), 10), 'year'); break;
			case 'M': result.set(parseInt(match.pop(), 10), 'month'); break;
			case 'D': result.set(parseInt(match.pop(), 10), 'day'); break;
		}

		return RTTI.$call(result, 'toDate', args);

	}
});

RTTI.$register(ArrayPrototype, 'toDate', (self, args) => {

	var value, result = new Date(0, 0, 1, 0, 0, 0);

	transform: {

		if (!self.has('year')) return;
		value = RTTI.$toInt(self.get('year'));
		if (value === undefined) return;
		result.setFullYear(value);

		if (!self.has('month')) break transform;
		value = RTTI.$toInt(self.get('month'), 1, 12);
		if (value === undefined) return;
		result.setMonth(value - 1);

		if (!self.has('day')) break transform;
		value = Utils.$getDaysInMonth(result.getFullYear(), result.getMonth() + 1);
		value = RTTI.$toInt(self.get('day'), 1, value);
		if (value === undefined) return;
		result.setDate(value);

		if (!self.has('hour')) break transform;
		value = RTTI.$toInt(self.get('hour'), 0, 23);
		if (value === undefined) return;
		result.setHours(value);

		if (!self.has('minute')) break transform;
		value = RTTI.$toInt(self.get('minute'), 0, 59);
		if (value === undefined) return;
		result.setMinutes(value);

		if (!self.has('second')) break transform;
		value = RTTI.$toInt(self.get('second'), 0, 59);
		if (value === undefined) return;
		result.setSeconds(value);

	}

	if (isFinite(result.getTime())) return new HistoneDate(result, args[0]);
});

RTTI.$register(GlobalPrototype, 'getDate', (self, args) => new HistoneDate(args[0]), Constants.RTTI_V_DIRTY);

RTTI.$register(DatePrototype, Constants.RTTI_M_TOJS, (self) => self.toJavaScript());
RTTI.$register(DatePrototype, 'isDate', true);
RTTI.$register(DatePrototype, 'toNumber', (self) => self.toJavaScript().getTime());

if (Constants.EXPERIMENTAL) {

	function addZero(value, add) {
		return add ? ('0' + value).slice(-2) : value;
	}

	RTTI.$register(DatePrototype, 'set', (self, args) => {
		self = RTTI.$call(self, [ArrayPrototype, 'set'], args);
		return RTTI.$call(self, 'toDate');
	});

	RTTI.$register(DatePrototype, Constants.RTTI_M_UNEVAL, (self) => [
		Constants.AST_CALL,
		'toDate',
		self.toJavaScript().getTime()
	]);

	RTTI.$register(DatePrototype, 'isLeapYear', (self) => {
		var year = self.get('year');
		return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
	});

	RTTI.$register(DatePrototype, 'toString', (self, args) => {

		var format = args && args.shift(),
			day = self.get('day'),
			month = self.get('month'),
			year = self.get('year'),
			hour = self.get('hour'),
			minute = self.get('minute'),
			second = self.get('second'),
			weekDay = new Date(year, month - 1, day).getDay() || 7;

		if (!Utils.$isString(format)) format = i18n(Constants.DATE_FORMAT);

		return format.replace(/[a-z]+/gi, function(match) {

			var longMatch = !(match.length % 2) ? 1 : 0;

			switch (match) {

				// Month day
				case 'D':
				case 'DD':
					return addZero(day, longMatch);

				// Week day
				case 'W':
				case 'WW':
					return i18n(Constants.WEEK_DAYS, weekDay - 1, longMatch ? 1 : 0);

				// Month
				case 'M':
				case 'MM':
					return addZero(month, longMatch);

				case 'MMM':
				case 'MMMM':
					return i18n(Constants.MONTH_NAMES, month - 1, longMatch ? 2 : 0);

				// Year
				case 'YYYY':
					return year;

				// AM/PM
				case 'A':
					return (hour > 12 ? 'PM' : 'AM');

				case 'a':
					return (hour > 12 ? 'pm' : 'am');

				// Hour
				case 'h':
				case 'hh':
				return addZero((hour > 12 ? hour - 12 : hour) || 12, longMatch);

				case 'hhh':
				case 'hhhh':
					return addZero(hour, longMatch);

				// Minute
				case 'm':
				case 'mm':
					return addZero(minute, longMatch);

				// Second
				case 's':
				case 'ss':
					return addZero(second, longMatch);

				default: return match;
			}
		})



	});

}