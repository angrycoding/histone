export default [

	(Histone, ret) => ret(Histone.toString() === ''),
	(Histone, ret) => ret(Histone.toString(undefined) === ''),
	(Histone, ret) => ret(Histone.toString(null) === 'null'),
	(Histone, ret) => ret(Histone.toString(true) === 'true'),
	(Histone, ret) => ret(Histone.toString(false) === 'false'),
	(Histone, ret) => ret(Histone.toString(NaN) === ''),
	(Histone, ret) => ret(Histone.toString(Infinity) === ''),
	(Histone, ret) => ret(Histone.toString(-Infinity) === ''),
	(Histone, ret) => ret(Histone.toString(0) === '0'),
	(Histone, ret) => ret(Histone.toString(-10) === '-10'),
	(Histone, ret) => ret(Histone.toString(10) === '10'),
	(Histone, ret) => ret(Histone.toString(Number.MAX_SAFE_INTEGER) === '9007199254740991'),
	(Histone, ret) => ret(Histone.toString(Number.MAX_VALUE) === '179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'),
	(Histone, ret) => ret(Histone.toString(1e20) === '100000000000000000000'),
	(Histone, ret) => ret(Histone.toString(100000000000000000000) === '100000000000000000000'),
	(Histone, ret) => ret(Histone.toString(1e21) === '1000000000000000000000'),
	(Histone, ret) => ret(Histone.toString(1000000000000000000000) === '1000000000000000000000'),
	(Histone, ret) => ret(Histone.toString(1e-6) === '0.000001'),
	(Histone, ret) => ret(Histone.toString(0.000001) === '0.000001'),
	(Histone, ret) => ret(Histone.toString(1e-7) === '0.0000001'),
	(Histone, ret) => ret(Histone.toString(0.0000001) === '0.0000001'),
	(Histone, ret) => ret(Histone.toString(1e-17) === '0.00000000000000001'),
	(Histone, ret) => ret(Histone.toString(0.00000000000000001) === '0.00000000000000001'),
	(Histone, ret) => ret(Histone.toString('string') === 'string'),
	(Histone, ret) => ret(Histone.toString(/regexp/) === '/regexp/'),
	(Histone, ret) => ret(Histone.toString(new RegExp) === '/(?:)/'),
	(Histone, ret) => ret(Histone.toString(/regexp/i) === '/regexp/i'),
	(Histone, ret) => ret(Histone.toString(/regexp/m) === '/regexp/m'),
	(Histone, ret) => ret(Histone.toString(/regexp/g) === '/regexp/g'),
	(Histone, ret) => ret(Histone.toString([]) === ''),
	(Histone, ret) => ret(Histone.toString([false]) === 'false'),
	(Histone, ret) => ret(Histone.toString([1, 2, 3]) === '1 2 3'),
	(Histone, ret) => ret(Histone.toString({}) === ''),
	(Histone, ret) => ret(Histone.toString({false: false}) === 'false'),
	(Histone, ret) => ret(Histone.toString({x: 1, y: 2, z: 3}) === '1 2 3'),
	(Histone, ret) => ret(Histone.toString(new Date) !== ''),
	(Histone, ret) => ret(Histone.toString(0, 1, 2) === '0'),
	(Histone, ret) => ret(Histone.toString(1, 2, 3) === '1'),
	(Histone, ret) => {
		Histone.register(Histone.Boolean.prototype, 'toString', 10);
		ret(Histone.toString(true) === 10);
	},
	(Histone, ret) => {
		Histone.register(Histone.Boolean.prototype, 'toString', function(self) {
			ret(self === false);
		});
		Histone.toString(false);
	},
	(Histone, ret) => {
		Histone.register(Histone.String.prototype, 'toString', function(self, args) {
			ret(args instanceof Array && args.length === 0);
		});
		Histone.toString('string', 1, 2, 3);
	},
	(Histone, ret) => {
		Histone.register(Histone.String.prototype, 'toString', function(self, args, scope, cb) {
			ret(cb === undefined);
		});
		Histone.toString('string', 1, 2, 3);
	},
	(Histone, ret) => {
		Histone.register(Histone.String.prototype, 'toString', function() {
			return 'MY_STRING';
		});
		ret(Histone.toString('string') === 'MY_STRING');
	},
	(Histone, ret) => {
		Histone.register(Histone.String.prototype, 'toString', function() { ret(true); });
		Histone.toString('string');
	},
	(Histone, ret) => {
		var Class = function(){};
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		ret(Histone.toString(new Class) === '');
	},
	(Histone, ret) => {
		var Class = function(){};
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		Histone.register(Histone.Base.prototype, 'toString', function() { ret(true); });
		Histone.toString(new Class);
	},
	(Histone, ret) => {
		var Class = function(){};
		Histone.register(Class.prototype, 'toString', 'testValue');
		ret(Histone.toString(new Class) === 'testValue');
	},
	(Histone, ret) => {
		var Class = function(){};
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		Histone.register(Histone.Base.prototype, 'toString', 'MY_STRING');
		ret(Histone.toString(new Class) === 'MY_STRING');
	},
	(Histone, ret) => {
		var Class = function() { Histone.Array.apply(this); this.set('foo', 'bar'); };
		Class.prototype = Object.create(Histone.Array.prototype);
		Class.prototype.constructor = Class;
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		ret(Histone.toString(new Class) === 'foo');
	},
	(Histone, ret) => {
		var Class = function() { Histone.Array.apply(this); };
		Class.prototype = Object.create(Histone.Array.prototype);
		Class.prototype.constructor = Class;
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		Histone.register(Histone.Array.prototype, 'toString', function() { ret(true); });
		Histone.toString(new Class);
	}

];