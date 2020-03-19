var ES5Map = function() {
	this._keys = [];
	this._values = [];
	this.size = 0;
};

ES5Map.prototype.values = function() {
	return [].concat(this._values);
};

ES5Map.prototype.keys = function() {
	return [].concat(this._keys);
};

ES5Map.prototype.set = function(key, value) {
	
	var keys = this._keys,
		values = this._values,
		index = keys.indexOf(key);

	if (index !== -1) {
		keys.splice(index, 1);
		values.splice(index, 1);
	}
	
	keys.push(key);
	this.size = this._values.push(value);

};

ES5Map.prototype.has = function(key) {
	return (this._keys.indexOf(key) !== -1);
};

ES5Map.prototype.get = function(key) {
	var index = this._keys.indexOf(key);
	if (index !== -1) return this._values[index];
};

ES5Map.prototype.delete = function(key) {
	var keys = this._keys, index = keys.indexOf(key);
	if (index !== -1) {
		keys.splice(index, 1);
		this._values.splice(index, 1);
		this.size = keys.length;
	}
};

ES5Map.prototype.clear = function() {
	this._keys = [];
	this._values = [];
	this.size = 0;
};

module.exports = ES5Map;