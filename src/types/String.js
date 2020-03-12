var RTTI = require('../RTTI'),
	Utils = require('../Utils'),
	Parser = require('../Parser'),
	Processor = require('../Processor'),
	Constants = require('../Constants'),
	HistoneMacro = RTTI.$Macro,
	BasePrototype = RTTI.$Base.prototype,
	StringPrototype = RTTI.$String.prototype;

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

RTTI.$register(StringPrototype, 'strip', (self, args) => {
	var arg, chars = '', start = -1, length = self.length;
	while (args.length) if (Utils.$isString(arg = args.shift())) chars += arg;
	if (chars.length === 0) chars = ' \n\r\t';
	while (start < length && chars.indexOf(self.charAt(++start)) !== -1){}
	while (length >= 0 && chars.indexOf(self.charAt(--length)) !== -1){}
	return self.slice(start, length + 1);
});

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

if (Constants.EXPERIMENTAL) {

	RTTI.$register(StringPrototype, Constants.RTTI_M_UNEVAL, Constants.RTTI_R_SELF);

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

}