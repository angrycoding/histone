var RTTI = require('../RTTI'),
	Utils = require('../Utils'),
	Constants = require('../Constants'),
	BasePrototype = RTTI.$Base.prototype,
	NumberPrototype = RTTI.$Number.prototype;

RTTI.$register(BasePrototype, 'isNumber', false);
RTTI.$register(NumberPrototype, 'isNumber', true);
RTTI.$register(NumberPrototype, 'toNumber', Constants.RTTI_R_SELF);
RTTI.$register(NumberPrototype, 'isInt', (self) => self % 1 === 0);
RTTI.$register(NumberPrototype, 'isFloat', (self) => self % 1 !== 0);
RTTI.$register(NumberPrototype, 'toBoolean', (self) => !!self);
RTTI.$register(NumberPrototype, 'toJSON', (self) => JSON.stringify(self));
RTTI.$register(NumberPrototype, 'toAbs', (self) => Math.abs(self));
RTTI.$register(NumberPrototype, 'toFloor', (self) => Math.floor(self));
RTTI.$register(NumberPrototype, 'toCeil', (self) => Math.ceil(self));
RTTI.$register(NumberPrototype, 'toRound', (self) => Math.round(self));

RTTI.$register(NumberPrototype, 'toChar', (self) => {
	if (self % 1 === 0 && self >= 0) {
		return String.fromCharCode(self);
	}
});

RTTI.$register(NumberPrototype, 'toFixed', (self, args) => {
	var digits = RTTI.$toInt(args[0], 0);
	if (digits === undefined) digits = 0;
	try { self = parseFloat(self.toFixed(digits)); }
	finally { return self; }
});

RTTI.$register(NumberPrototype, 'toString', (self) => {
	var value = String(self).split(/[eE]/);
	if (value.length === 1) return value[0];
	var result = '';
	var numeric = value[0].replace('.', '');
	var exponent = Number(value[1]) + 1;
	if (exponent < 0) {
		if (self < 0) result += '-';
		result += '0.';
		while (exponent++) result += '0';
		return result + numeric.replace(/^\-/,'');
	}
	exponent -= numeric.length;
	while (exponent--) result += '0';
	return numeric + result;
});

if (Constants.EXPERIMENTAL) {
	RTTI.$register(NumberPrototype, Constants.RTTI_M_UNEVAL, Constants.RTTI_R_SELF);
}