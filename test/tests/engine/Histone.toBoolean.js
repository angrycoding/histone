module.exports = [

	(Histone, ret) => ret(Histone.toBoolean() === false),
	(Histone, ret) => ret(Histone.toBoolean(undefined) === false),
	(Histone, ret) => ret(Histone.toBoolean(null) === false),
	(Histone, ret) => ret(Histone.toBoolean(true) === true),
	(Histone, ret) => ret(Histone.toBoolean(false) === false),
	(Histone, ret) => ret(Histone.toBoolean(NaN) === false),
	(Histone, ret) => ret(Histone.toBoolean(Infinity) === false),
	(Histone, ret) => ret(Histone.toBoolean(-Infinity) === false),
	(Histone, ret) => ret(Histone.toBoolean(0) === false),
	(Histone, ret) => ret(Histone.toBoolean(-10) === true),
	(Histone, ret) => ret(Histone.toBoolean(10) === true),
	(Histone, ret) => ret(Histone.toBoolean('string') === true),
	(Histone, ret) => ret(Histone.toBoolean('') === false),
	(Histone, ret) => ret(Histone.toBoolean(' ') === true),
	(Histone, ret) => ret(Histone.toBoolean(/regexp/) === true),
	(Histone, ret) => ret(Histone.toBoolean(new RegExp) === true),
	(Histone, ret) => ret(Histone.toBoolean([]) === true),
	(Histone, ret) => ret(Histone.toBoolean([false]) === true),
	(Histone, ret) => ret(Histone.toBoolean([1, 2, 3]) === true),
	(Histone, ret) => ret(Histone.toBoolean({}) === true),
	(Histone, ret) => ret(Histone.toBoolean({false: false}) === true),
	(Histone, ret) => ret(Histone.toBoolean({x: 1, y: 2, z: 3}) === true),
	(Histone, ret) => ret(Histone.toBoolean(new Date) === true),
	(Histone, ret) => ret(Histone.toBoolean(0, 1, 2) === false),
	(Histone, ret) => ret(Histone.toBoolean(1, 2, 3) === true),

	(Histone, ret) => {
		Histone.register(Histone.String.prototype, 'toBoolean', 10);
		ret(Histone.toBoolean('string') === 10);
	},

	(Histone, ret) => {
		Histone.register(Histone.String.prototype, 'toBoolean', function(self) {
			ret(self === 'string');
		});
		Histone.toBoolean('string');
	},

	(Histone, ret) => {
		Histone.register(Histone.String.prototype, 'toBoolean', function(self, args) {
			ret(args instanceof Array && args.length === 0);
		});
		Histone.toBoolean('string', 1, 2, 3);
	},

	(Histone, ret) => {
		Histone.register(Histone.String.prototype, 'toBoolean', function(self, args, scope, cb) {
			ret(cb === undefined);
		});
		Histone.toBoolean('string', 1, 2, 3);
	},

	(Histone, ret) => {
		Histone.register(Histone.String.prototype, 'toBoolean', function() {
			return 'MY_BOOLEAN';
		});
		ret(Histone.toBoolean('string') === 'MY_BOOLEAN');
	},

	(Histone, ret) => {
		Histone.register(Histone.String.prototype, 'toBoolean', function() { ret(true); });
		Histone.toBoolean('string');
	},

	(Histone, ret) => {
		var Class = function(){};
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		ret(Histone.toBoolean(new Class) === false);
	},

	(Histone, ret) => {
		var Class = function(){};
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		Histone.register(Histone.Base.prototype, 'toBoolean', function() { ret(true); });
		Histone.toBoolean(new Class);
	},

	(Histone, ret) => {
		var Class = function(){};
		Histone.register(Class.prototype, 'toBoolean', 'testValue');
		ret(Histone.toBoolean(new Class) === 'testValue');
	},

	(Histone, ret) => {
		var Class = function(){};
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		Histone.register(Histone.Base.prototype, 'toBoolean', 'MY_BOOLEAN');
		ret(Histone.toBoolean(new Class) === 'MY_BOOLEAN');
	},

	(Histone, ret) => {
		var Class = function() { Histone.Array.apply(this); };
		Class.prototype = Object.create(Histone.Array.prototype);
		Class.prototype.constructor = Class;
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		ret(Histone.toBoolean(new Class) === true);
	},

	(Histone, ret) => {
		var Class = function() { Histone.Array.apply(this); };
		Class.prototype = Object.create(Histone.Array.prototype);
		Class.prototype.constructor = Class;
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		Histone.register(Histone.Array.prototype, 'toBoolean', function() { ret(true); });
		Histone.toBoolean(new Class);
	}

];