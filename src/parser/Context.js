import Utils from '../Utils.js';
import Constants from '../Constants.js';

function isPrimitiveVal(value) {
	return (
		value === null ||
		typeof value === 'number' ||
		typeof value === 'string' ||
		typeof value === 'boolean' ||
		typeof value === 'undefined' ||
		value instanceof Array && value[0] === Constants.AST_UNDEFINED
	);
}

function Context(baseURI) {
	this.baseURI = baseURI;
	this.scopeChain = [];
	this.indexChain = [];
	this.macroChain = [];
	this.loopChain = [[]];
	this.scopeEnter();
}

Context.prototype.macroEnter = function(node) {
	this.macroChain.unshift(node, this.scopeChain.length - 1);
};

Context.prototype.macroExit = function() {
	this.macroChain.splice(0, 2);
};

Context.prototype.loopEnter = function(label) {
	var loopChain = this.loopChain;
	if (!arguments.length) loopChain.unshift([]);
	else loopChain.unshift([label].concat(loopChain[0]));
};

Context.prototype.loopGet = function(label) {
	var labels = this.loopChain[0];
	if (!arguments.length) return !!labels.length;
	labels = labels.indexOf(label);
	return (labels === -1 ? label : labels);
}

Context.prototype.loopExit = function() {
	this.loopChain.shift();
};

Context.prototype.scopeEnter = function() {
	this.indexChain.unshift(0);
	this.scopeChain.unshift({});
};


Context.prototype.setVar = function(name, value) {

	if (!Utils.$isString(name)) return;

	var variables = this.scopeChain[0];

	if (arguments.length > 1 && isPrimitiveVal(value)) {
		variables[name] = {primitive: true, value: value};
		return;
	}

	if (!variables.hasOwnProperty(name) || variables[name].constant || variables[name].primitive) {
		variables[name] = {
			constant: false,
			macro: this.macroChain[0],
			index: this.indexChain[0]++
		};
	}

	return variables[name].index;

};

Context.prototype.getVar = function(name) {

	var level, variables, variable,
		macroChain = this.macroChain,
		scopeChain = this.scopeChain,
		scopeChainLen = scopeChain.length;

	for (level = 0; level < scopeChainLen; level++) {
		variables = scopeChain[level];
		if (variables.hasOwnProperty(name)) {

			variable = variables[name];

			if (variable.primitive) return variable.value;
			if (macroChain[0] === variable.macro) return [Constants.AST_REF, level, variable.index];

			variable.constant = true;
			return [Constants.AST_REF, level, variable.index, level - (scopeChainLen - macroChain[1])];


		}
	}
};

Context.prototype.scopeExit = function() {
	this.scopeChain.shift();
	this.indexChain.shift();
};

export default Context;