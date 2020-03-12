module.exports = [

	(Histone, ret) => ret(Histone.toHistone() === undefined),
	(Histone, ret) => ret(Histone.toHistone(undefined) === undefined),
	(Histone, ret) => ret(Histone.toHistone(null) === null),
	(Histone, ret) => ret(Histone.toHistone(true) === true),
	(Histone, ret) => ret(Histone.toHistone(false) === false),
	(Histone, ret) => ret(Histone.toHistone(NaN) === undefined),
	(Histone, ret) => ret(Histone.toHistone(Infinity) === undefined),
	(Histone, ret) => ret(Histone.toHistone(-Infinity) === undefined),
	(Histone, ret) => ret(Histone.toHistone(0) === 0),
	(Histone, ret) => ret(Histone.toHistone(-10) === -10),
	(Histone, ret) => ret(Histone.toHistone(10) === 10),
	(Histone, ret) => ret(Histone.toHistone(Number.MAX_SAFE_INTEGER) === Number.MAX_SAFE_INTEGER),
	(Histone, ret) => ret(Histone.toHistone(Number.MAX_VALUE) === Number.MAX_VALUE),
	(Histone, ret) => ret(Histone.toHistone('string') === 'string'),
	(Histone, ret) => ret(Histone.toHistone(/regexp/) instanceof RegExp),
	(Histone, ret) => ret(Histone.toHistone(new RegExp) instanceof RegExp),
	(Histone, ret) => { var regexp = /regexp/; ret(Histone.toHistone(regexp) === regexp); },
	(Histone, ret) => { var regexp = new RegExp; ret(Histone.toHistone(regexp) === regexp); },
	(Histone, ret) => ret(Histone.toHistone([]) instanceof Histone.Array),
	(Histone, ret) => { var array = [1, 2, 3]; ret(Histone.toHistone(array) !== array); },
	(Histone, ret) => { var array = new Histone.Array; ret(Histone.toHistone(array) === array); },
	(Histone, ret) => ret(Histone.toHistone({}) instanceof Histone.Array),
	(Histone, ret) => { var object = {foo: 'bar'}; ret(Histone.toHistone(object) !== object); },
	(Histone, ret) => ret(Histone.toHistone(new Date) instanceof Histone.Date),
	(Histone, ret) => { var date = new Date; ret(Histone.toHistone(date) !== date); },
	(Histone, ret) => { var date = new Histone.Date; ret(Histone.toHistone(date) === date); },
	(Histone, ret) => ret(Histone.toHistone(0, 1, 2) === 0),
	(Histone, ret) => ret(Histone.toHistone(1, 2, 3) === 1),
	(Histone, ret) => ret(Histone.toHistone(function(){}) instanceof Histone.Array),
	(Histone, ret) => ret(Histone.toHistone(new function(){}) instanceof Histone.Array),
	(Histone, ret) => {
		var Class = function(){};
		Histone.register(Class.prototype, 'foo');
		var instance = new Class;
		ret(Histone.toHistone(instance) === instance);
	},
	(Histone, ret) => {
		var Class = function(){};
		ret(Histone.toHistone(new Class) instanceof Histone.Array);
	}

];