import RTTI from '../RTTI.js';
import Utils from '../Utils.js';
import Constants from '../Constants.js';

const
	HistoneArray = RTTI.$Array,
	HistoneMacro = RTTI.$Macro,
	BasePrototype = RTTI.$Base.prototype,
	ArrayPrototype = HistoneArray.prototype;

function mergeSort(arr, sorter, ret) {
	var length = arr.length;
	if (length < 2) return ret(arr);
	var middle = parseInt(length / 2);
	mergeSort(arr.slice(0, middle), sorter, function(left) {
		mergeSort(arr.slice(middle, length), sorter, function(right) {
			merge(left, right, sorter, ret);
		});
	});
}

function merge(left, right, sorter, ret) {
	var processCompare, result = [];
	Utils.$for(function(iterator) {
		if (!left.length || !right.length) {
			Array.prototype.push.apply(result, left);
			Array.prototype.push.apply(result, right);
			ret(result);
		} else sorter(left[0], right[0], processCompare || (
			processCompare = function(comparison) {
				result.push(comparison ? right.shift() : left.shift());
				iterator();
			}
		));
	});
}

RTTI.$register(BasePrototype, 'isArray', false);
RTTI.$register(BasePrototype, 'toArray', (self) => {
	if (self instanceof HistoneArray) return self;
	var result = new HistoneArray();
	result.set(self);
	return result;
});

RTTI.$register(ArrayPrototype, Constants.RTTI_M_GET, (self, args) => self.get(args[0]));
RTTI.$register(ArrayPrototype, Constants.RTTI_M_TOJS, (self) => self.toJavaScript(RTTI.$toJavaScript));
RTTI.$register(ArrayPrototype, 'isArray', true);
RTTI.$register(ArrayPrototype, 'toBoolean', true);
RTTI.$register(ArrayPrototype, 'length', (self) => self.getLength());
RTTI.$register(ArrayPrototype, 'keys', (self) => self.getKeys());
RTTI.$register(ArrayPrototype, 'values', (self) => self.getValues());
RTTI.$register(ArrayPrototype, 'first', (self) => self.getFirst());
RTTI.$register(ArrayPrototype, 'last', (self) => self.getLast());
RTTI.$register(ArrayPrototype, 'has', (self, args) => self.has(RTTI.$toString(args[0])));

RTTI.$register(ArrayPrototype, 'toString', (self) => {
	var value, result = [], values = self.getValues();
	while (values.length) {
		if (value = RTTI.$toString(values.shift())) {
			result.push(value);
		}
	}
	return result.join(' ');
});

RTTI.$register(ArrayPrototype, 'toJSON', (self) => {
	var index = 0, result = [], isArray = true,
		keys = self.getKeys(), values = self.getValues();
	for (var c = 0; c < values.length; c++) {
		result.push(RTTI.$toJSON(values[c]));
		if (isArray && keys[c] !== String(index++)) {
			isArray = false;
		}
	}
	if (isArray) return '[' + result.join(',') + ']';
	return '{' + result.map(function(value, index) {
		return JSON.stringify(keys[index]) + ':' + value;
	}).join(',') + '}';
});

RTTI.$register(ArrayPrototype, 'join', (self, args) => {
	var result = [], values = self.getValues(), separator = '';
	if (args.length > 0) separator = RTTI.$toString(args[0]);
	while (values.length) result.push(RTTI.$toString(values.shift()));
	return result.join(separator);
});

RTTI.$register(ArrayPrototype, 'chunk', (self, args) => {
	
	var result = [],
		size = RTTI.$toInt(args[0], 1),
		values = self.getValues(),
		keys = self.isArray() ? [] : self.getKeys();

	if (size === undefined) size = 1;
	for (var chunk, c = 0; c < values.length; c++) {
		if (c % size === 0) result.push(chunk = new HistoneArray);
		chunk.set(values[c], keys[c]);
	}
	return result;
});

RTTI.$register(ArrayPrototype, 'some', (self, args, scope, ret) => {
	var processItem, filter = args.shift(), resultState = Constants.RTTI_V_CLEAN;
	if (!(filter instanceof HistoneMacro)) return ret(false, resultState);
	self.some((value, ret, key) => {
		if (!processItem) processItem = (value, state) => (resultState |= state, ret(RTTI.$toBoolean(value)));
		filter.call(args.concat(value, key, self), scope, processItem);
	}, (result) => ret(result, resultState));
});

RTTI.$register(ArrayPrototype, 'every', (self, args, scope, ret) => {
	var processItem, filter = args.shift(), resultState = Constants.RTTI_V_CLEAN;
	if (!(filter instanceof HistoneMacro)) return ret(false, resultState);
	self.every((value, ret, key) => {
		if (!processItem) processItem = (value, state) => (resultState |= state, ret(RTTI.$toBoolean(value)));
		filter.call(args.concat(value, key, self), scope, processItem);
	}, (result) => ret(result, resultState));
});

RTTI.$register(ArrayPrototype, 'filter', (self, args, scope, ret) => {
	var processItem, filter = args.shift(), resultState = Constants.RTTI_V_CLEAN;
	if (!(filter instanceof HistoneMacro)) return ret([], resultState);
	self.filter((value, ret, key) => {
		if (!processItem) processItem = (value, state) => (resultState |= state, ret(RTTI.$toBoolean(value)));
		filter.call(args.concat(value, key, self), scope, processItem);
	}, (result) => ret(result, resultState));
});

RTTI.$register(ArrayPrototype, 'map', (self, args, scope, ret) => {
	var processItem, filter = args.shift(), resultState = Constants.RTTI_V_CLEAN;
	if (!(filter instanceof HistoneMacro)) return ret(new Array(self.getLength()).fill(undefined));
	self.map((value, ret, key) => {
		if (!processItem) processItem = (value, state) => (resultState |= state, ret(value));
		filter.call(args.concat(value, key, self), scope, processItem);
	}, (result) => ret(result, resultState));
});

RTTI.$register(ArrayPrototype, 'group', (self, args, scope, ret) => {
	var filter = args.shift(), resultState = Constants.RTTI_V_CLEAN;
	if (!(filter instanceof HistoneMacro)) return ret(self, resultState);

	var processItem, result = new HistoneArray(),
		keys = self.getKeys(), values = self.getValues();

	Utils.$for(function(iterator, iteration) {

		if (!iterator) return ret(result, resultState);

		filter.call(
			args.concat(values[iteration], keys[iteration], self),
			scope, processItem || (processItem = function(value, state) {
				
				(
					result.has(value = RTTI.$toString(value)) ?
					result.get(value) :
					result.set(new HistoneArray(), value)
				).set(values[iterator.iteration]);

				resultState |= state;
				iterator();

			})
		);

	}, 0, values.length - 1);
});

RTTI.$register(ArrayPrototype, 'find', (self, args, scope, ret) => {

	var filter = args.shift(), resultState = Constants.RTTI_V_CLEAN;
	if (!(filter instanceof HistoneMacro)) return ret(undefined, resultState);

	var processItem,
		keys = self.getKeys(),
		values = self.getValues(),
		returnKey = RTTI.$toBoolean(args.shift());

	Utils.$for(function(iterator, iteration) {

		if (!iterator) return ret(undefined, resultState);

		filter.call(
			args.concat(values[iteration], keys[iteration], self),
			scope, processItem || (processItem = function(value, state) {
				resultState |= state;
				RTTI.$toBoolean(value) ?
				ret((returnKey ? keys : values)[iterator.iteration], resultState) :
				iterator();
			})
		);

	}, 0, keys.length - 1);
});

RTTI.$register(ArrayPrototype, 'slice', (self, args) => {
	var offset = RTTI.$toInt(args[0]),
		length = RTTI.$toInt(args[1]),
		result = new HistoneArray(),
		values = self.getValues(),
		arrLen = values.length,
		keys = self.isArray() ? [] : self.getKeys();
	if (offset === undefined) offset = 0;
	if (offset < 0) offset = arrLen + offset;
	if (offset < 0) offset = 0;
	if (offset > arrLen) return [];
	if (length === undefined) length = 0;
	if (length === 0) length = arrLen - offset;
	if (length < 0) length = arrLen - offset + length;
	if (length <= 0) return [];
	values = values.slice(offset, offset + length);
	keys = keys.slice(offset, offset + length);
	while (values.length) result.set(values.shift(), keys.shift());
	return result;
});

RTTI.$register(ArrayPrototype, 'set', (self, args) => {
	if (!args.length) return self;
	self = self.clone();
	self.set(args[0], args[1]);
	return self;
});

RTTI.$register(ArrayPrototype, 'shuffle', (self) => {

	var keys = self.getKeys(),
		values = self.getValues(),
		rIndex, cIndex = keys.length,
		result = new HistoneArray(),
		isArray = self.isArray();

	while (cIndex) {
		rIndex = Math.floor(Math.random() * cIndex--);
		keys[rIndex] = [keys[cIndex], keys[cIndex] = keys[rIndex]][0];
		values[rIndex] = [values[cIndex], values[cIndex] = values[rIndex]][0];
	}

	while (values.length) result.set(values.shift(), isArray ? undefined : keys.shift());

	return result;
}, Constants.RTTI_V_DIRTY);

RTTI.$register(ArrayPrototype, 'flip', (self) => {
	var keys = self.getKeys(), values = self.getValues(), result = new HistoneArray();
	while (keys.length) result.set(keys.shift(), values.shift());
	return result;
});

RTTI.$register(ArrayPrototype, 'reverse', (self, args) => {
	var isArray = self.isArray(), keys = self.getKeys(),
		values = self.getValues(), result = new HistoneArray();
	while (values.length) result.set(values.pop(), isArray ? undefined : keys.pop());
	return result;
});

RTTI.$register(ArrayPrototype, 'sort', (self, args, scope, ret) => {

	var sorter = args.shift(),
		keys = self.isArray() ? [] : self.getKeys(),
		resultState = Constants.RTTI_V_CLEAN;

	if (!(sorter instanceof HistoneMacro)) sorter = null;

	mergeSort(self.getValues().map(function(value, index) {

		return {
			key: keys[index],
			value: value
		};

	}), function(left, right, ret) {

		if (sorter) sorter.call(args.concat(
			left.value, right.value,
			left.key, right.key
		), scope, function(value, state) {
			resultState |= state;
			ret(RTTI.$toBoolean(value));
		});

		else ret(
			RTTI.$toString(left.value) >
			RTTI.$toString(right.value)
		);


	}, function(result) {
		
		var resultArray = new HistoneArray;

		while (result.length) {
			sorter = result.shift();
			resultArray.set(sorter.value, sorter.key);
		}

		ret(resultArray, resultState);
	});
});





RTTI.$register(ArrayPrototype, 'reduce', (self, args, scope, ret) => {
	var filter = args.shift();
	if (!(filter instanceof HistoneMacro)) return ret();

	var processItem, offset = 0,
		keys = self.getKeys(),
		values = self.getValues(),
		resultState = Constants.RTTI_V_CLEAN,
		result = (args.length ? args.shift() : (offset++, values[0]));

	Utils.$for(function(iterator, iteration) {

		if (!iterator) return ret(result, resultState);

		filter.call(
			args.concat(result, values[iteration], keys[iteration], self),
			scope, processItem || (processItem = function(value, state) {
				resultState |= state;
				result = value;
				iterator();
			})
		);

		
	}, offset, values.length - 1);

});




