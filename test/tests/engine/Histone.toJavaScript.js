export default [

	(Histone, ret) => ret(Histone.toJavaScript() === undefined),
	(Histone, ret) => ret(Histone.toJavaScript(undefined) === undefined),
	(Histone, ret) => ret(Histone.toJavaScript(null) === null),
	(Histone, ret) => ret(Histone.toJavaScript(true) === true),
	(Histone, ret) => ret(Histone.toJavaScript(false) === false),
	(Histone, ret) => ret(Histone.toJavaScript(NaN) === undefined),
	(Histone, ret) => ret(Histone.toJavaScript(Infinity) === undefined),
	(Histone, ret) => ret(Histone.toJavaScript(-Infinity) === undefined),
	(Histone, ret) => ret(Histone.toJavaScript(0) === 0),
	(Histone, ret) => ret(Histone.toJavaScript(-10) === -10),
	(Histone, ret) => ret(Histone.toJavaScript(10) === 10),
	(Histone, ret) => ret(Histone.toJavaScript(Number.MAX_SAFE_INTEGER) === Number.MAX_SAFE_INTEGER),
	(Histone, ret) => ret(Histone.toJavaScript(Number.MAX_VALUE) === Number.MAX_VALUE),
	(Histone, ret) => ret(Histone.toJavaScript('string') === 'string'),
	(Histone, ret) => ret(Histone.toJavaScript(/regexp/) instanceof RegExp),
	(Histone, ret) => ret(Histone.toJavaScript(new RegExp) instanceof RegExp),
	(Histone, ret) => ret(Histone.toJavaScript(/regexp/i) instanceof RegExp),
	(Histone, ret) => ret(Histone.toJavaScript(/regexp/m) instanceof RegExp),
	(Histone, ret) => ret(Histone.toJavaScript(/regexp/g) instanceof RegExp),
	(Histone, ret) => { var regexp = /regexp/; ret(Histone.toJavaScript(regexp) === regexp); },
	(Histone, ret) => { var regexp = new RegExp; ret(Histone.toJavaScript(regexp) === regexp); },
	(Histone, ret) => ret(Histone.toJavaScript([]) instanceof Array),
	(Histone, ret) => ret(Histone.toJavaScript([]).length === 0),
	(Histone, ret) => ret(Histone.toJavaScript([false]) instanceof Array),
	(Histone, ret) => ret(Histone.toJavaScript([false]).length === 1),
	(Histone, ret) => ret(Histone.toJavaScript([false])[0] === false),
	(Histone, ret) => ret(Histone.toJavaScript([1, 2, 3]) instanceof Array),
	(Histone, ret) => ret(Histone.toJavaScript([1, 2, 3]).length === 3),
	(Histone, ret) => { var array = [1, 2, 3]; ret(Histone.toJavaScript(array) !== array); },
	(Histone, ret) => ret(Histone.toJavaScript({}) instanceof Object),
	(Histone, ret) => ret(Object.keys(Histone.toJavaScript({})).length === 0),
	(Histone, ret) => ret(Histone.toJavaScript({false: false}) instanceof Object),
	(Histone, ret) => ret(Object.keys(Histone.toJavaScript({false: false})).length === 1),
	(Histone, ret) => ret(Histone.toJavaScript({false: false}).false === false),
	(Histone, ret) => ret(Histone.toJavaScript({x: 1, y: 2, z: 3}) instanceof Object),
	(Histone, ret) => ret(Object.keys(Histone.toJavaScript({x: 1, y: 2, z: 3})).length === 3),
	(Histone, ret) => ret(Histone.toJavaScript({x: 1, y: 2, z: 3}).x === 1),
	(Histone, ret) => ret(Histone.toJavaScript({x: 1, y: 2, z: 3}).y === 2),
	(Histone, ret) => ret(Histone.toJavaScript({x: 1, y: 2, z: 3}).z === 3),
	(Histone, ret) => ret(Histone.toJavaScript(new Date) instanceof Date),
	(Histone, ret) => { var date = new Date; ret(Histone.toJavaScript(date) !== date); },
	(Histone, ret) => ret(Histone.toJavaScript(0, 1, 2) === 0),
	(Histone, ret) => ret(Histone.toJavaScript(1, 2, 3) === 1),
	(Histone, ret) => {
		Histone.register(Histone.Boolean.prototype, Histone.M_TOJS, 10);
		ret(Histone.toJavaScript(true) === 10);
	},
	(Histone, ret) => {
		Histone.register(Histone.Boolean.prototype, Histone.M_TOJS, function(self) {
			ret(self === false);
		});
		Histone.toJavaScript(false);
	},
	(Histone, ret) => {
		Histone.register(Histone.String.prototype, Histone.M_TOJS, function(self, args) {
			ret(args instanceof Array && args.length === 0);
		});
		Histone.toJavaScript('string', 1, 2, 3);
	},
	(Histone, ret) => {
		Histone.register(Histone.String.prototype, Histone.M_TOJS, function(self, args, scope, cb) {
			ret(cb === undefined);
		});
		Histone.toJavaScript('string', 1, 2, 3);
	},
	(Histone, ret) => {
		Histone.register(Histone.String.prototype, Histone.M_TOJS, function() {
			return 'MY_STRING';
		});
		ret(Histone.toJavaScript('string') === 'MY_STRING');
	},
	(Histone, ret) => {
		Histone.register(Histone.String.prototype, Histone.M_TOJS, function() { ret(true); });
		Histone.toJavaScript('string');
	},
	(Histone, ret) => {
		var Class = function(){};
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		ret(Histone.toJavaScript(new Class) instanceof Class);
	},
	(Histone, ret) => {
		var Class = function(){};
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		var instance = new Class;
		ret(Histone.toJavaScript(instance) === instance);
	},
	(Histone, ret) => {
		var Class = function(){};
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		Histone.register(Histone.Base.prototype, Histone.M_TOJS, function() { ret(true); });
		Histone.toJavaScript(new Class);
	},
	(Histone, ret) => {
		var Class = function(){};
		Histone.register(Class.prototype, Histone.M_TOJS, 'testValue');
		ret(Histone.toJavaScript(new Class) === 'testValue');
	},
	(Histone, ret) => {
		var Class = function(){};
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		Histone.register(Histone.Base.prototype, Histone.M_TOJS, 'MY_STRING');
		ret(Histone.toJavaScript(new Class) === 'MY_STRING');
	},
	(Histone, ret) => {
		var Class = function() { Histone.Array.apply(this); this.set('foo', 'bar'); };
		Class.prototype = Object.create(Histone.Array.prototype);
		Class.prototype.constructor = Class;
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		ret(Histone.toJavaScript(new Class) instanceof Object);
	},
	(Histone, ret) => {
		var Class = function() { Histone.Array.apply(this); this.set('foo', 'bar'); };
		Class.prototype = Object.create(Histone.Array.prototype);
		Class.prototype.constructor = Class;
		Histone.register(Class.prototype, 'testMethod', 'testValue');
		ret(Histone.toJavaScript(new Class).bar === 'foo');
	},
	(Histone, ret) => {
		var Class = function() { Histone.Array.apply(this); this.set('foo', 'bar'); };
		Class.prototype = Object.create(Histone.Array.prototype);
		Class.prototype.constructor = Class;
		Histone.register(Class.prototype, Histone.M_TOJS, 'testValue');
		ret(Histone.toJavaScript(new Class) === 'testValue');
	},
	(Histone, ret) => {
		var Class = function() { Histone.Array.apply(this); };
		Class.prototype = Object.create(Histone.Array.prototype);
		Class.prototype.constructor = Class;
		Histone.register(Class.prototype, Histone.M_TOJS, Histone.R_SELF);
		var instance = new Class;
		ret(Histone.toJavaScript(instance) === instance);
	}

];