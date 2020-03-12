var RTTI = require('../RTTI'),
	Utils = require('../Utils'),
	Constants = require('../Constants');

function removeOutputNodes(parent) {
	var c, child, length = parent.length - 1;
	parent.push(parent.shift());
	while (length--) {
		child = parent.shift();
		switch (Utils.$isArray(child) ? child[0] : null) {

			case Constants.AST_IF: {
				for (c = 1; c < child.length; c += 2)
					removeOutputNodes(child[c]);
				parent.push(child);
				break;
			}

			case Constants.AST_WHILE: {
				removeOutputNodes(child[1]);
				parent.push(child);
				break;
			}

			case Constants.AST_FOR: {
				for (c = 3; c < child.length; c += 2)
					removeOutputNodes(child[c]);
				parent.push(child);
				break;
			}

			case Constants.AST_VAR:
			case Constants.AST_RETURN:
			case Constants.AST_SUPPRESS: {
				parent.push(child);
				break;
			}

		}
	}
}

function cleanupReturnStatements(parent, pIndex) {
	var node = parent[pIndex];
	if (Utils.$isArray(node)) switch (node[0]) {

		case Constants.AST_BREAK:
		case Constants.AST_RETURN:
		case Constants.AST_CONTINUE:

			// process children
			cleanupReturnStatements(node, 1);

			// remove everything after statement
			parent.splice(pIndex + 1);

			// remove output nodes before return
			if (node[0] === Constants.AST_RETURN)
				removeOutputNodes(parent);

			break;

		default: for (var c = 1; c < node.length; c++) {
			cleanupReturnStatements(node, c);
		}

	}
}

function removeUnusedVars(node) {

	var nameCounter = 0;

	function getTempName() {
		return (++nameCounter + '$removeUnusedVars');
	}

	function getUsedVars(node) {

		var scopeChain = [{}], usedVars = [];

		function getUsedVars(node) {
			if (Utils.$isArray(node)) switch (node[0]) {

				case Constants.AST_VAR: {
					getUsedVars(node[1]);
					scopeChain[0][node[2]] = node;
					break;
				}

				case Constants.AST_REF: {
					usedVars.push(scopeChain[node[1]][node[2]]);
					break;
				}

				case Constants.AST_IF: {
					for (var c = 1; c < node.length; c += 2) {
						getUsedVars(node[c + 1]);
						scopeChain.unshift({});
						getUsedVars(node[c]);
						scopeChain.shift();
					}
					break;
				}

				case Constants.AST_NODES: {
					scopeChain.unshift({});
					for (var c = 1; c < node.length; c++)
						getUsedVars(node[c]);
					scopeChain.shift();
					break;
				}

				case Constants.AST_WHILE: {
					scopeChain.unshift({});
					getUsedVars(node[1]);
					scopeChain.shift();
					getUsedVars(node[2]);
					break;
				}

				case Constants.AST_FOR: {
					scopeChain.unshift({});
					var key = getTempName(), value = getTempName();
					if (node[1]) scopeChain[0][node[1]] = key;
					if (node[2]) scopeChain[0][node[2]] = value;
					getUsedVars(node[3]);
					if (usedVars.indexOf(key) === -1) node[1] = null;
					if (usedVars.indexOf(value) === -1) node[2] = null;
					scopeChain.shift();
					getUsedVars(node[4]);
					for (var c = 5; c < node.length; c += 2) {
						getUsedVars(node[c + 1]);
						scopeChain.unshift({});
						getUsedVars(node[c]);
						scopeChain.shift();
					}
					break;
				}

				case Constants.AST_MACRO: {


					var params = [];
					scopeChain.unshift({});

					for (var c = 4; c < node.length; c += 2) {
						params.push(c, scopeChain[0][node[c] + 1] = getTempName());
					}

					getUsedVars(node[2]);
					scopeChain.shift();

					while (params.length)
						if (usedVars.indexOf(params.pop()) === -1)
							node.splice(params.pop(), 2);
						else getUsedVars(node[params.pop() + 1]);

					break;
				}

				default: for (var c = 1; c < node.length; c++) {
					getUsedVars(node[c]);
				}

			}
		}

		return getUsedVars(node), usedVars;
	}

	function removeUnusedVars(nodes, usedVars) {
		if (!Utils.$isArray(nodes)) return false;
		var node, repeat = false, length = nodes.length;
		nodes.push(nodes.shift());
		while (--length) switch (Utils.$isArray(node = nodes.shift()) ? node[0] : null) {

			case Constants.AST_VAR: {
				if (usedVars.indexOf(node) !== -1) {
					repeat = (removeUnusedVars(node[1], usedVars) || repeat);
					nodes.push(node);
				} else repeat = true;
				break;
			}

			default: {
				repeat = (removeUnusedVars(node, usedVars) || repeat);
				nodes.push(node);
			}

		}
		return repeat;
	}


	while (removeUnusedVars(node, getUsedVars(node)));
}

function compressNodeLists(node) {

	function canMoveUp(node, pFlag) {

		if (Utils.$isArray(node)) switch (node[0]) {

			case Constants.AST_RETURN: {
				return !pFlag;
			}

			case Constants.AST_BREAK:
			case Constants.AST_CONTINUE:
			case Constants.AST_VAR:
			case Constants.AST_SUPPRESS: {
				return true;
			}

			case Constants.AST_NODES: {
				for (var c = 1; c < node.length; c++)
					if (!canMoveUp(node[c], true)) return false;
				return true;
			}

			case Constants.AST_NODELIST: {
				for (var c = 1; c < node.length; c++)
					if (!canMoveUp(node[c], pFlag)) return false;
				return true;
			}


			case Constants.AST_IF: {
				for (var c = 1; c < node.length; c += 2)
					if (!canMoveUp(node[c], pFlag)) return false;
				return true;
			}

			case Constants.AST_FOR: {
				for (var c = 3; c < node.length; c += 2)
					if (!canMoveUp(node[c], pFlag)) return false;
				return true;
			}

			case Constants.AST_WHILE: {
				return canMoveUp(node[1], pFlag);
			}



		}

		return false;
	}

	function doCompress(parentNode) {

		if (Utils.$isArray(parentNode)) {

			var length = parentNode.length;

			if ([Constants.AST_NODES, Constants.AST_NODELIST].indexOf(parentNode[0]) !== -1) {

				var childNode, stringIndex = 0;

				parentNode.push(parentNode.shift());

				while (--length) {

					childNode = compressNodeLists(parentNode.shift());


					if (canMoveUp(childNode)) {
						if (stringIndex)
							parentNode.splice(parentNode.length - stringIndex, 0, childNode);
						else parentNode.push(childNode);
					}

					else if (Utils.$isPrimitive(childNode)) {
						childNode = RTTI.$toString(childNode);
						if (stringIndex) parentNode[parentNode.length - stringIndex] += childNode;
						else stringIndex++, parentNode.push(childNode);
					}

					else if (Utils.$isArray(childNode) && childNode[0] === Constants.AST_UNDEFINED) {
						childNode = RTTI.$toString(undefined);
						if (stringIndex) parentNode[parentNode.length - stringIndex] += childNode;
						else stringIndex++, parentNode.push(childNode);
					}

					else {
						stringIndex = 0;
						parentNode.push(childNode);
					}

				}

				if (parentNode.length === 2 && Utils.$isString(parentNode[1])) {
					parentNode = parentNode[1];
				}

			}

			else for (var c = 1; c < length; c++) {
				parentNode[c] = compressNodeLists(parentNode[c]);
			}

		}

		return parentNode;
	}

	return doCompress(node);
}

var Optimize = function(node) {
	cleanupReturnStatements([node], 0);
	removeUnusedVars(node);
	return compressNodeLists(node);
};

Optimize.compressNodeLists = compressNodeLists;



module.exports = Optimize;