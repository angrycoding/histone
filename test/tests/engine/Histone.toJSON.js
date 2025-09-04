export default [

	(Histone, ret) => ret(Histone.toJSON() === 'null'),
	(Histone, ret) => ret(Histone.toJSON(undefined) === 'null'),
	(Histone, ret) => ret(Histone.toJSON(null) === 'null'),
	(Histone, ret) => ret(Histone.toJSON(true) === 'true'),
	(Histone, ret) => ret(Histone.toJSON(false) === 'false'),
	(Histone, ret) => ret(Histone.toJSON(NaN) === 'null'),
	(Histone, ret) => ret(Histone.toJSON(Infinity) === 'null'),
	(Histone, ret) => ret(Histone.toJSON(-Infinity) === 'null'),
	(Histone, ret) => ret(Histone.toJSON(Number.MAX_SAFE_INTEGER) === '9007199254740991'),
	(Histone, ret) => ret(Histone.toJSON(Number.MAX_VALUE) === '1.7976931348623157e+308'),
	(Histone, ret) => ret(Histone.toJSON(0) === '0'),
	(Histone, ret) => ret(Histone.toJSON(-10) === '-10'),
	(Histone, ret) => ret(Histone.toJSON(10) === '10'),
	(Histone, ret) => ret(Histone.toJSON(1e20) === '100000000000000000000'),
	(Histone, ret) => ret(Histone.toJSON(100000000000000000000) === '100000000000000000000'),
	(Histone, ret) => ret(Histone.toJSON(1e21) === '1e+21'),
	(Histone, ret) => ret(Histone.toJSON(1000000000000000000000) === '1e+21'),
	(Histone, ret) => ret(Histone.toJSON(1e-6) === '0.000001'),
	(Histone, ret) => ret(Histone.toJSON(0.000001) === '0.000001'),
	(Histone, ret) => ret(Histone.toJSON(1e-7) === '1e-7'),
	(Histone, ret) => ret(Histone.toJSON(0.0000001) === '1e-7'),
	(Histone, ret) => ret(Histone.toJSON('string') === '"string"'),
	(Histone, ret) => ret(Histone.toJSON("str'ing") === '"str\'ing"'),
	(Histone, ret) => ret(Histone.toJSON('str"ing') === '"str\\"ing"'),
	(Histone, ret) => ret(Histone.toJSON('str\ning') === '"str\\ning"'),
	(Histone, ret) => ret(Histone.toJSON(/regexp/) === '"/regexp/"'),
	(Histone, ret) => ret(Histone.toJSON(/regexp/i) === '"/regexp/i"'),
	(Histone, ret) => ret(Histone.toJSON(/regexp/m) === '"/regexp/m"'),
	(Histone, ret) => ret(Histone.toJSON(/regexp/g) === '"/regexp/g"'),
	(Histone, ret) => ret(Histone.toJSON([]) === '[]'),
	(Histone, ret) => ret(Histone.toJSON([1, 2, 3]) === '[1,2,3]'),
	(Histone, ret) => ret(Histone.toJSON({}) === '[]'),
	(Histone, ret) => ret(Histone.toJSON({x: 1, y: 2, z: 3}) === '{"x":1,"y":2,"z":3}'),
	(Histone, ret) => ret(Histone.toJSON(new Date(1985, 6, 25, 0, 0, 0)) === '{"day":25,"month":7,"year":1985,"hour":0,"minute":0,"second":0}'),
	(Histone, ret) => ret(Histone.toJSON(1, 2, 3) === '1'),

	(Histone, ret) => {
		Histone.register(Histone.String.prototype, 'toJSON', 10);
		ret(Histone.toJSON('string') === 10);
	},

	(Histone, ret) => {
		Histone.register(Histone.String.prototype, 'toJSON', function(self) {
			ret(self === 'string');
		});
		Histone.toJSON('string');
	},

	(Histone, ret) => {
		Histone.register(Histone.String.prototype, 'toJSON', function(self, args) {
			ret(args instanceof Array && args.length === 0);
		});
		Histone.toJSON('string', 1, 2, 3);
	},

	(Histone, ret) => {
		Histone.register(Histone.String.prototype, 'toJSON', function(self, args, scope, cb) {
			ret(cb === undefined);
		});
		Histone.toJSON('string', 1, 2, 3);
	},

	(Histone, ret) => {
		Histone.register(Histone.String.prototype, 'toJSON', function() {
			return 'MY_JSON';
		});
		ret(Histone.toJSON('string') === 'MY_JSON');
	},

	(Histone, ret) => {
		Histone.register(Histone.String.prototype, 'toJSON', function() { ret(true); });
		Histone.toJSON('string');
	},

	(Histone, ret) => {
		var Class = function(){};
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		ret(Histone.toJSON(new Class) === 'null');
	},

	(Histone, ret) => {
		var Class = function(){};
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		Histone.register(Histone.Base.prototype, 'toJSON', function() { ret(true); });
		Histone.toJSON(new Class);
	},

	(Histone, ret) => {
		var Class = function(){};
		Histone.register(Class.prototype, 'toJSON', 'testValue');
		ret(Histone.toJSON(new Class) === 'testValue');
	},

	(Histone, ret) => {
		var Class = function(){};
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		Histone.register(Histone.Base.prototype, 'toJSON', 'MY_JSON');
		ret(Histone.toJSON(new Class) === 'MY_JSON');
	},

	(Histone, ret) => {
		var Class = function() { Histone.Array.apply(this); };
		Class.prototype = Object.create(Histone.Array.prototype);
		Class.prototype.constructor = Class;
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		ret(Histone.toJSON(new Class) === '[]');
	},

	(Histone, ret) => {
		var Class = function() { Histone.Array.apply(this); };
		Class.prototype = Object.create(Histone.Array.prototype);
		Class.prototype.constructor = Class;
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		Histone.register(Histone.Array.prototype, 'toJSON', function() { ret(true); });
		Histone.toJSON(new Class);
	}

];