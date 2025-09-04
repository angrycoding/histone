import Utils from "../Utils.js";

function HistoneArray() {
	this._nextIntKey = 0;
	this._map = new Map();
}

/** @expose */
HistoneArray.prototype.map = function(retn, retf) {

	var key, processItem,
		keys = this.getKeys(),
		values = this.getValues(),
		result = new HistoneArray();

	if (!Utils.$isFunction(retf)) {
		while (keys.length)
			result.set(retn(values.shift(), keys.shift()));
		return result;
	}

	else Utils.$for((next, index) => {
		if (next) {
			key = keys[index];
			if (!processItem) processItem = (value) => (result.set(value, key), next());
			retn(values[index], processItem, key, this);
		} else retf(result);
	}, 0, values.length - 1);
};

/** @expose */
HistoneArray.prototype.filter = function(retn, retf) {

	var key, value, processItem,
		keys = this.getKeys(),
		values = this.getValues(),
		isArray = this.isArray(),
		result = new HistoneArray();

	Utils.$for((next, index) => {
		if (!next) return retf(result);
		key = keys[index], value = values[index];
		if (!processItem) processItem = function(include) {
			if (include) result.set(value, isArray ? undefined : key);
			next();
		};
		retn(value, processItem, key, this);
	}, 0, values.length - 1);

};

/** @expose */
HistoneArray.prototype.some = function(retn, retf) {

	var processItem,
		keys = this.getKeys(),
		values = this.getValues();

	Utils.$for((next, index) => {
		if (next) {
			if (!processItem) processItem = (result) => (result ? retf(true) : next());
			retn(values[index], processItem, keys[index], this);
		} else retf(false);
	}, 0, values.length - 1);
};

/** @expose */
HistoneArray.prototype.every = function(retn, retf) {

	var processItem,
		keys = this.getKeys(),
		values = this.getValues();

	Utils.$for((next, index) => {
		if (next) {
			if (!processItem) processItem = (result) => (result ? next() : retf(false));
			retn(values[index], processItem, keys[index], this);
		} else retf(true);
	}, 0, values.length - 1);
};

/** @expose */
HistoneArray.prototype.clone = function() {

	var value,
		keys = [...this._map.keys()],
		values = [...this._map.values()],
		result = new HistoneArray();

	while (keys.length) {
		value = values.shift();
		if (value instanceof HistoneArray)
			value = value.clone();
		result.set(value, keys.shift());
	}

	return result;
};





/** @expose */
HistoneArray.prototype.isMap = function() {
	for (var keys = this.getKeys(), c = 0; c < keys.length; c++)
		if (keys[c] !== String(c)) return true;
	return false;
};

/** @expose */
HistoneArray.prototype.isArray = function() {
	return !this.isMap();
};

/** @expose */
HistoneArray.prototype.getLength = function() {
	return this._map.size;
};

/** @expose */
HistoneArray.prototype.has = function(key) {
	return this._map.has(String(key));
};

/** @expose */
HistoneArray.prototype.get = function(key) {
	return this._map.get(String(key));
};

/** @expose */
HistoneArray.prototype.set = function(value, key) {

	var intKey = Utils.$str2num(key);

	if (Utils.$isInteger(intKey) && intKey >= 0) {
		this._nextIntKey = Math.max(this._nextIntKey, (key = intKey) + 1);
	}

	else if (Utils.$isUndefined(key)) {
		key = this._nextIntKey++;
	}

	this._map.set(String(key), value);


	return value;
};




HistoneArray.prototype.forEachAsync = function(ret) {

	var last = this._map.size - 1,
		keys = this.getKeys(),
		values = this.getValues();

	Utils.$for(function(iterator, iteration) {

		if (iterator) ret(iterator, values[iteration], keys[iteration], iteration, last);
		else ret();

	}, 0, last);

};


HistoneArray.prototype.concat = function() {

	var arg, isMap = false,
		keys = [], values = [],
		result = new HistoneArray(),
		args = [this].concat(Array.prototype.slice.call(arguments));

	while (args.length) if ((arg = args.shift()) instanceof HistoneArray) {
		if (arg.isMap()) isMap = true;
		keys = keys.concat(arg.getKeys());
		values = values.concat(arg.getValues());
	}

	while (values.length) if (isMap)
		result.set(values.shift(), keys.shift());
	else result.set(values.shift());

	return result;

};

/** @expose */
HistoneArray.prototype.toJavaScript = function(toJavaScript) {

	var i, key, value, index = 0,
		result = [], isArray = true,
		keys = this.getKeys(),
		values = this.getValues();

	for (i = 0; i < values.length; i++) {

		key = keys[i], value = toJavaScript(values[i]);
		if (isArray) result.push(value); else result[key] = value;

		if (isArray && key !== String(index++)) {
			isArray = {};
			for (index = 0; index < result.length; index++)
				isArray[keys[index]] = result[index];
			result = isArray;
			isArray = false;
		}
	}
	return result;
};





/** @expose */
HistoneArray.prototype.getFirst = function() {
	var values = [...this._map.values()];
	return values[0];
};

/** @expose */
HistoneArray.prototype.getLast = function() {
	var values = [...this._map.values()];
	return values[values.length - 1];
};

/** @expose */
HistoneArray.prototype.getValues = function() {
	return [...this._map.values()];
};

/** @expose */
HistoneArray.prototype.getKeys = function() {
	return [...this._map.keys()];
};


export default HistoneArray;