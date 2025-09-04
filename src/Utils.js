var MS_IN_DAY = (1000 * 60 * 60 * 24),
	DOUBLE_SLASH = /\/\//g,
	TRAILING_FRAGMENT = /([^\/]*)$/,
	REGEXP_ESCAPE = /([.?*+^$[\]\\(){}|-])/g,
	URL_PARSER_REGEXP = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?\#]*)(\?([^#]*))?(#(.*))?/;


var str2num_re = /^\s*([-+])?(?:(?:0[xX]([0-9A-Fa-f]+))|(?:0[bB]([0-1]+))|((?:[0-9]*\.)?[0-9]+(?:[eE][+-]?[0-9]+)?))\s*$/;

function isNumber(value) {
	return (typeof value === 'number' && isFinite(value));
}


var isInteger = ('isInteger' in Number ? Number.isInteger : function(value) {
	return isNumber(value) && !(value % 1);
});

function str2num(value) {
	if (typeof value === 'string' && (value = value.match(str2num_re))) {
		var negative = (value[1] === '-');
		if (value[4]) value = parseFloat(value[4]);
		else if (value[2]) value = parseInt(value[2], 16);
		else if (value[3]) value = parseInt(value[3], 2);
		if (isNumber(value)) {
			if (negative) value = -value;
			return value;
		}
	}
}

function forAsync(iterator, begin, end, step) {

	if (arguments.length < 3) end = Infinity;

	if (!begin) begin = 0;
	if (!step) step = 1;

	var calls = 0,
		idle = true,

		it = function() {
			calls += 1;
			if (idle) {
				idle = false;

				while (calls > 0) {
					calls -= 1;

					iterator((it.iteration += step) <= end ? it : null, it.iteration);

				}

				idle = true;
			}
		};

	it.iteration = -step + begin;


	it();

}

function isUndefined(value) {
	return (typeof value === 'undefined');
}

function isString(value) {
	return (typeof value === 'string');
}


var isArray = ('isArray' in Array ? Array.isArray : function(value) {
	return (value instanceof Array);
});


function isFunction(value) {
	return (typeof value === 'function');
}

function isObject(value) {
	return (typeof value === 'object');
}

function isPrimitive(value) {
	return (
		value === null ||
		typeof value === 'undefined' ||
		typeof value === 'boolean' ||
		typeof value === 'string' ||
		typeof value === 'number'
	);
}

function parseURI(uri) {
	if (!isString(uri)) return {};
	var result = uri.match(URL_PARSER_REGEXP);
	return {
		scheme: result[1] ? result[2] : null,
		authority: result[3] ? result[4] : null,
		path: result[5],
		query: result[6] ? result[7] : null,
		fragment: result[8] ? result[9] : null
	};
}

function formatURI(uri) {
	return (
		(uri.scheme ? uri.scheme + '://' : '') +
		(uri.authority ? uri.authority : '') +
		(uri.path ? uri.path : '') +
		(uri.query ? '?' + uri.query : '') +
		(uri.fragment ? '#' + uri.fragment : '')
	);
}

function removeDotSegments(path) {

	if (path === '/') return '/';

	var up = 0, out = [],
		segments = path.split('/'),
		leadingSlash = (path[0] === '/' ? '/' : ''),
		trailingSlash = (path.slice(-1) === '/' ? '/' : '');

	while (segments.length) switch (path = segments.shift()) {
		case '': case '.': break;
		case '..': if (out.length) out.pop(); else up++; break;
		default: out.push(path);
	}

	if (!leadingSlash) {
		while (up--) out.unshift('..');
		if (!out.length) out.push('.');
	}

	return (leadingSlash + out.join('/') + trailingSlash);
}


function resolveURI(relURI, baseURI) {

	var absURI = '', absScheme,
		absAuthority, absPath,
		absQuery, absFragment,
		relURI = parseURI(relURI),
		baseURI = parseURI(baseURI),
		relScheme = relURI.scheme,
		relAuthority = relURI.authority,
		relPath = relURI.path,
		relQuery = relURI.query,
		relFragment = relURI.fragment,
		baseScheme = baseURI.scheme,
		baseAuthority = baseURI.authority,
		basePath = baseURI.path,
		baseQuery = baseURI.query;


	if (isString(relScheme)) {
		absScheme = relScheme;
		absAuthority = relAuthority;
		absPath = relPath;
		absQuery = relQuery;
		absFragment = relFragment;
	}

	else if (isString(relAuthority)) {
		absScheme = baseScheme;
		absAuthority = relAuthority;
		absPath = relPath;
		absQuery = relQuery;
		absFragment = relFragment;
	}

	else if (relPath === '') {
		absScheme = baseScheme;
		absAuthority = baseAuthority;
		absPath = basePath;
		absQuery = (isString(relQuery) ? relQuery : baseQuery);
		absFragment = relFragment;
	}

	else if (relPath[0] === '/') {
		absScheme = baseScheme;
		absAuthority = baseAuthority;
		absPath = relPath;
		absQuery = relQuery;
		absFragment = relFragment;
	}

	else if (isString(baseAuthority) && basePath === '') {
		absScheme = baseScheme;
		absAuthority = baseAuthority;
		absPath = ('/' + relPath);
		absQuery = relQuery;
		absFragment = relFragment;
	}

	else {
		absScheme = baseScheme;
		absAuthority = baseAuthority;
		absPath = basePath.replace(TRAILING_FRAGMENT, '') + relPath;
		absQuery = relQuery;
		absFragment = relFragment;
	}

	if (isString(absScheme)) absURI += (absScheme.toLowerCase() + ':');
	if (isString(absAuthority)) absURI += ('//' + absAuthority);
	absURI += removeDotSegments(absPath.replace(DOUBLE_SLASH, '/'));
	if (absQuery) absURI += ('?' + absQuery);
	if (absFragment) absURI += ('#' + absFragment);

	return absURI;
}

function escapeRegExp(string) {
	return string.replace(REGEXP_ESCAPE, '\\$1');
}

function htmlentities(string) {
	if (!isString(string)) return;
	return string.replace(/&/g, "&amp;")
	.replace(/</g, "&lt;")
	.replace(/>/g, "&gt;")
	.replace(/"/g, "&quot;")
	.replace(/'/g, "&#039;");
}

function isLeapYear(year) {
    // високосный: кратен 4, но не 100, кроме кратных 400
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getDaysInMonth(year, month) {
	if (month === 2) return isLeapYear(year) ? 29 : 28;
	if ([4, 6, 9, 11].includes(month)) return 30;
	return 31;
}

function dateOffset(date, offset) {
	if (isString(offset)) offset.replace(/((?:[+-]\d+)|\^|\$)([YMWDhms])/g, function($0, opValue, period) {

		if (opValue[0] === '+' || opValue[0] === '-') {

			if (opValue[0] === '+') {
				opValue = parseInt(opValue.slice(1), 10);
			} else {
				opValue = -parseInt(opValue.slice(1), 10);
			}

		}

		else period = (opValue + period);

		switch (period) {

			// start of the period

			case '^Y':
				date.setMonth(0);
				date.setDate(1);
				date.setHours(0);
				date.setMinutes(0);
				date.setSeconds(0);
				break;

			case '^M':
				date.setDate(1);
				date.setHours(0);
				date.setMinutes(0);
				date.setSeconds(0);
				break;

			case '^W':
				date.setDate(date.getDate() - ((date.getDay() || 7) - 1));
				date.setHours(0);
				date.setMinutes(0);
				date.setSeconds(0);
				break;

			case '^D':
				date.setHours(0);
				date.setMinutes(0);
				date.setSeconds(0);
				break;

			case '^h':
				date.setMinutes(0);
				date.setSeconds(0);
				break;

			case '^m':
				date.setSeconds(0);
				break;

			// end of the period

			case '$Y':
				date.setMonth(11);
				date.setDate(31);
				date.setHours(23);
				date.setMinutes(59);
				date.setSeconds(59);
				break;

			case '$M':
				date.setDate(getDaysInMonth(date.getFullYear(), date.getMonth() + 1));
				date.setHours(23);
				date.setMinutes(59);
				date.setSeconds(59);
				break;

			case '$W':
				date.setDate(date.getDate() + (7 - (date.getDay() || 7)));
				date.setHours(23);
				date.setMinutes(59);
				date.setSeconds(59);
				break;

			case '$D':
				date.setHours(23);
				date.setMinutes(59);
				date.setSeconds(59);
				break;

			case '$h':
				date.setMinutes(59);
				date.setSeconds(59);
				break;

			case '$m':
				date.setSeconds(59);
				break;

			case 'Y': date.setFullYear(date.getFullYear() + opValue); break;
			case 'M': date.setMonth(date.getMonth() + opValue); break;
			case 'W': date.setDate(date.getDate() + opValue * 7); break;
			case 'D': date.setDate(date.getDate() + opValue); break;
			case 'h': date.setHours(date.getHours() + opValue); break;
			case 'm': date.setMinutes(date.getMinutes() + opValue); break;
			case 's': date.setSeconds(date.getSeconds() + opValue); break;
		}
	});
	return date;
}





export default {
	$str2num: str2num,
	$for: forAsync,
	$escapeRegExp: escapeRegExp,
	$isPrimitive: isPrimitive,
	$isUndefined: isUndefined,
	$isString: isString,
	$isArray: isArray,
	$isNumber: isNumber,
	$isInteger: isInteger,
	$isObject: isObject,
	$isFunction: isFunction,
	$htmlentities: htmlentities,
	$parseURI: parseURI,
	$formatURI: formatURI,
	$resolveURI: resolveURI,
	$getDaysInMonth: getDaysInMonth,
	$dateOffset: dateOffset
};