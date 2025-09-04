import RTTI from '../RTTI.js';
import Utils from '../Utils.js';
import Parser from '../Parser.js';
import Processor from '../Processor.js';
import Constants from '../Constants.js';

const 
	HistoneMacro = RTTI.$Macro,
	BasePrototype = RTTI.$Base.prototype,
	StringPrototype = RTTI.$String.prototype,
	DO_BOTH = 0, DO_START = -1, DO_END = 1;

function stripTrim(self, args, direction) {
	var arg, chars = '', start = -1, length = self.length;
	while (args.length) if (Utils.$isString(arg = args.shift())) chars += arg;
	if (chars.length === 0) chars = ' \n\r\t';

	if (direction === DO_BOTH || direction === DO_START) {
		while (start < length && chars.indexOf(self.charAt(++start)) !== -1){}
	} else start = 0;

	if (direction === DO_BOTH || direction === DO_END) {
		while (length >= 0 && chars.indexOf(self.charAt(--length)) !== -1){}
	}

	return self.slice(start, length + 1);
}

function includesContains(self, args) {
	if (!args.length) return false;
	var fragment = RTTI.$toString(args[0]),
		start = (args.length >= 2 ? RTTI.$toInt(args[1]) : 0);
	if (start === undefined) return false;
	return self.slice(start).includes(fragment);
}

function padStartEnd(self, args, direction) {
	var targetLength = RTTI.$toInt(args[0]);
	if (targetLength === undefined || targetLength <= self.length) return self;
	var padString = (args.length >= 2 ? RTTI.$toString(args[1]) : ' ');
	return direction === DO_START ? self.padStart(targetLength, padString) : self.padEnd(targetLength, padString);
}

function indexOfLastIndexOf(self, args, direction) {
	if (!args.length) return -1;
	var callArgs = [RTTI.$toString(args[0])];
	var start = RTTI.$toInt(args[1]);
	if (start === undefined && args.length >= 2) return -1;
	if (args.length >= 2) callArgs.push(start);
	return (
		direction === DO_START ?
		String.prototype.indexOf.apply(self, callArgs) :
		String.prototype.lastIndexOf.apply(self, callArgs)
	);
}

RTTI.$register(BasePrototype, 'isString', false);
RTTI.$register(BasePrototype, 'toString', '');

RTTI.$register(StringPrototype, Constants.RTTI_M_GET, (self, args) => {
	var index = RTTI.$toInt(args[0]);
	if (index !== undefined) {
		var length = self.length;
		if (index < 0) index = length + index;
		if (index >= 0 && index < length) {
			return self[index];
		}
	}
});

RTTI.$register(StringPrototype, 'isString', true);
RTTI.$register(StringPrototype, 'toString', Constants.RTTI_R_SELF);
RTTI.$register(StringPrototype, 'toNumber', (self) => Utils.$str2num(self));
RTTI.$register(StringPrototype, 'toBoolean', (self) => self.length > 0);
RTTI.$register(StringPrototype, 'toJSON', (self) => JSON.stringify(self));
RTTI.$register(StringPrototype, 'length', (self) => self.length);
RTTI.$register(StringPrototype, 'toLowerCase', (self) => self.toLowerCase());
RTTI.$register(StringPrototype, 'toUpperCase', (self) => self.toUpperCase());
RTTI.$register(StringPrototype, 'htmlentities', (self) => Utils.$htmlentities(self));

RTTI.$register(StringPrototype, 'split', (self, args) => {
	var separator = args[0];
	if (Utils.$isString(separator)) {
		separator = Utils.$escapeRegExp(separator);
		separator = new RegExp(separator, 'g');
	}
	return self.split(separator instanceof RegExp ? separator : '');
});

RTTI.$register(StringPrototype, 'charCodeAt', (self, args) => {
	var index = RTTI.$toInt(args[0]);
	if (index !== undefined) {
		var length = self.length;
		if (index < 0) index = length + index;
		if (index >= 0 && index < length) {
			return self.charCodeAt(index);
		}
	}
});

RTTI.$register(StringPrototype, 'strip', (self, args) => stripTrim(self, args, DO_BOTH));
RTTI.$register(StringPrototype, 'trim', (self, args) => stripTrim(self, args, DO_BOTH));
RTTI.$register(StringPrototype, 'stripStart', (self, args) => stripTrim(self, args, DO_START));
RTTI.$register(StringPrototype, 'trimStart', (self, args) => stripTrim(self, args, DO_START));
RTTI.$register(StringPrototype, 'stripEnd', (self, args) => stripTrim(self, args, DO_END));
RTTI.$register(StringPrototype, 'trimEnd', (self, args) => stripTrim(self, args, DO_END));

RTTI.$register(StringPrototype, 'slice', (self, args) => {
	var strlen = self.length,
		start = (args.length > 0 ? RTTI.$toInt(args[0]) : 0),
		length = (args.length > 1 ? RTTI.$toInt(args[1]) : strlen);
	if (start === undefined || length === undefined) return;
	if (start < 0) start = strlen + start;
	if (start < 0) start = 0;
	if (start >= strlen) return '';
	if (length === 0) length = strlen - start;
	if (length < 0) length = strlen - start + length;
	if (length <= 0) return '';
	return self.substr(start, length);
});

RTTI.$register(StringPrototype, 'replace', (self, args, scope, ret) => {

	var search = args[0], replace = args[1];

	if (Utils.$isString(search))
		search = new RegExp(Utils.$escapeRegExp(search), 'g');

	if (search instanceof RegExp) {

		if (replace instanceof HistoneMacro) {

			var match, matches, processReplace,
				result = '', lastPos = 0,
				resultState = Constants.RTTI_V_CLEAN;

			Utils.$for(function(iterator) {

				if (match = search.exec(self)) {
					if (lastPos < match.index) result += self.slice(lastPos, match.index);
					lastPos = match.index + match[0].length;
					replace.call(Array.prototype.slice.call(match), scope, processReplace || (
						processReplace = function(value, state) {
							resultState |= state;
							result += value;
							iterator();
						}
					));
				}

				else {
					ret(result + self.slice(lastPos), resultState);

				}

			});

		} else ret(self.replace(search, RTTI.$toString(replace)));

	} else ret(self);
});

RTTI.$register(StringPrototype, 'eval', (self, args, scope, ret) => {
	var thisObj = args[0], baseURI = args[1];
	if (!Utils.$isString(baseURI)) baseURI = scope.baseURI;
	try { self = Parser(self, baseURI); } catch (exception) {}
	(new Processor(baseURI, thisObj, scope.shadowObj)).process(self, ret);
});

RTTI.$register(StringPrototype, 'reverse', (self) => {
	var result = '', index = self.length;
	while (index--) result += self[index];
	return result;
});

RTTI.$register(StringPrototype, 'startsWith', (self, args) => {
	if (!args.length) return false;
	return self.startsWith(RTTI.$toString(args[0]));
});

RTTI.$register(StringPrototype, 'endsWith', (self, args) => {
	if (!args.length) return false;
	return self.endsWith(RTTI.$toString(args[0]));
});

RTTI.$register(StringPrototype, 'includes', includesContains);
RTTI.$register(StringPrototype, 'contains', includesContains);

RTTI.$register(StringPrototype, 'repeat', (self, args) => {
	var times = RTTI.$toInt(args[0]);
	if (times === undefined || times <= 1) return self;
	return self.repeat(times);
});

RTTI.$register(StringPrototype, 'padStart', (self, args) => padStartEnd(self, args, DO_START));
RTTI.$register(StringPrototype, 'padEnd', (self, args) => padStartEnd(self, args, DO_END));

RTTI.$register(StringPrototype, 'indexOf', (self, args) => indexOfLastIndexOf(self, args, DO_START));
RTTI.$register(StringPrototype, 'lastIndexOf', (self, args) => indexOfLastIndexOf(self, args, DO_END));