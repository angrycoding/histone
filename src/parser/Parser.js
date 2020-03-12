var Utils = require('../Utils'),
	Tokens = require('./Tokens'),
	Context = require('./Context'),
	Tokenizer = require('regexp-lexer'),
	Optimizer = require('./Optimizer'),
	Constants = require('../Constants'),
	isDevVersion = (Constants.VERSION === 'dev'),
	ctx, tokenizer, T_NOP = -1, T_BREAK = -2, T_ARRAY = -3,
	// used to validate numeric array keys
	validInteger = /^[1-9][0-9]*$/,
	// used to convert control characters into regular characters
	stringEscapeRegExp = /\\(x[0-9A-F]{2}|u[0-9A-F]{4}|\n|.)/g,
	// error messages
	E_ILLEGAL_BREAK ='illegal break statement',
	E_ILLEGAL_CONTINUE = 'illegal continue statement',
	E_KEY_VALUE_MUST_DIFFER = 'key and value must differ',
	E_MIXED_ARRAY_MAP = 'cant\'t mix array and map',
	E_UNEXPECTED = (value) => `unexpected ${value}`,
	E_DUPLICATE_PARAMETER = (value) => `duplicate parameter name "${value}"`,
	E_UNTERMINATED_REGEXP = (value) => `unterminated regexp literal "${value}"`,
	E_UNTERMINATED_STRING = (value) => `unterminated string literal ${value}`,
	E_DUPLICATE_LABEL = (value) => `label "${value}" has already been declared`,
	E_UNDEFINED_LABEL = (value) => `undefined label "${value}"`,
	E_EXCEPTION = (uri, line, message) => `${uri}(${line}) Syntax error: ${message}`;


//{{%

function ParserException(lex, message) {
	var baseURI = ctx.baseURI,
		lineNumber = lex.getCurrentLineNumber();
	return {
		baseURI: baseURI,
		lineNumber: lineNumber,
		toString: function() { return this.message; },
		message: E_EXCEPTION(baseURI, lineNumber, message)
	};
}

function parserException(lex, message) {
	if (!message) {
		message = lex.testToken();
		message = E_UNEXPECTED(message.type === lex.$EOF ? 'EOF' : '"' + message.value + '"');
	}
	throw new ParserException(lex, message);
}

function escapeStringLiteral(string) {
	return string.replace(stringEscapeRegExp, function(str, match) {
		switch (match[0]) {
			// null character
			case '0': return String.fromCharCode(0);
			// backspace
			case 'b': return String.fromCharCode(8);
			// form feed
			case 'f': return String.fromCharCode(12);
			// new line
			case 'n': return String.fromCharCode(10);
			// carriage return
			case 'r': return String.fromCharCode(13);
			// horizontal tab
			case 't': return String.fromCharCode(9);
			// vertical tab
			case 'v': return String.fromCharCode(11);
			// hexadecimal sequence (2 digits: dd)
			case 'x': return String.fromCharCode(parseInt(match.substr(1), 16));
			// unicode sequence (4 hex digits: dddd)
			case 'u': return String.fromCharCode(parseInt(match.substr(1), 16));
			// by default return escaped character "as is"
			default: return match;
		}
	});
}

function parseExpressionList(lex) {
	var result = [];
	do result.push(startExpression(lex));
	while (lex.nextToken(Tokens.$COMMA));
	return result;
}

function parseArgumentList(lex) {
	var result = [];
	if (lex.nextToken(Tokens.$LPAREN) && !lex.nextToken(Tokens.$RPAREN)) {
		result = parseExpressionList(lex);
		if (!lex.nextToken(Tokens.$RPAREN)) parserException(lex);
	}
	return result;
}

function parseMacroParameters(lex, allowSingle) {

	var paramName, result = [];

	if (allowSingle && (paramName = lex.nextToken(Tokens.$ID))) {
		result.push(paramName.value, null);
	}

	else if (lex.nextToken(Tokens.$LPAREN) && !lex.nextToken(Tokens.$RPAREN)) {

		do {

			if (paramName = lex.nextToken(Tokens.$ID)) {
				if (result.indexOf(paramName = paramName.value) !== -1) parserException(lex, E_DUPLICATE_PARAMETER(paramName));
				result.push(paramName, lex.nextToken(Tokens.$EQ) ? [result.length / 2, startExpression(lex)] : null);
			} else parserException(lex);

		} while (lex.nextToken(Tokens.$COMMA));



		if (!lex.nextToken(Tokens.$RPAREN)) parserException(lex);

	}


	return result;

}

function parseStartStatement(lex, result) {

	var node = lex.nextToken();

	switch (node.type) {
		case Tokens.$CMT_START: node = commentStatement(lex); break;
		case Tokens.$AST_START: node = astStatement(lex); break;
		case Tokens.$BLOCK_START: node = templateStatement(lex); break;
		case Tokens.$LITERAL_START: node = literalStatement(lex); break;
		case lex.$EOF: node = [T_BREAK]; break;
		default: node = node.value;
	}

	switch (Utils.$isArray(node) ? node[0] : null) {
		case T_NOP: return true;
		case T_BREAK: return false;
		case T_ARRAY: Array.prototype.push.apply(result, node.slice(1)); return true;
		default: result.push(node); return true;
	}

}

function extractReferences(node) {

	var keys = [];
	var values = [];

	function doExtract(node) {

		if (Utils.$isArray(node)) switch (node[0]) {

			case Constants.AST_REF: {
				if (node.length > 3) {
					var key = node.slice(2).join('.');
					if (keys.indexOf(key) === -1) {
						keys.push(key);
						values.push([
							node[0],
							node[3],
							node[2]
						]);
					}
					node.splice(3);
				}
				break;
			}

			case Constants.AST_MACRO: {
				break;
			}

			default: for (var c = 1; c < node.length; c++) {
				doExtract(node[c]);
			}

		}

	}

	doExtract(node);

	return values.length ? values : Constants.RTTI_V_CLEAN;

}

function getTokenizer() {
	return (tokenizer || (tokenizer = new Tokenizer(
		[Tokens.$PROP, Tokens.$UNDEFINED], /undefined\b/,
		[Tokens.$PROP, Tokens.$NULL], /null\b/,
		[Tokens.$PROP, Tokens.$TRUE], /true\b/,
		[Tokens.$PROP, Tokens.$FALSE], /false\b/,
		[Tokens.$PROP, Tokens.$STATEMENT, Tokens.$ELSEIF], /elseif\b/,
		[Tokens.$PROP, Tokens.$STATEMENT, Tokens.$IF], /if\b/,
		[Tokens.$PROP, Tokens.$STATEMENT, Tokens.$IN], /in\b/,
		[Tokens.$PROP, Tokens.$STATEMENT, Tokens.$AS], /as\b/,
		[Tokens.$PROP, Tokens.$STATEMENT, Tokens.$FOR], /for\b/,
		[Tokens.$PROP, Tokens.$STATEMENT, Tokens.$VAR], /var\b/,
		[Tokens.$PROP, Tokens.$STATEMENT, Tokens.$ELSE], /else\b/,
		[Tokens.$PROP, Tokens.$STATEMENT, Tokens.$MACRO], /macro\b/,
		[Tokens.$PROP, Tokens.$STATEMENT, Tokens.$RETURN], /return\b/,
		[Tokens.$PROP, Tokens.$STATEMENT, Tokens.$BREAK], /break\b/,
		[Tokens.$PROP, Tokens.$STATEMENT, Tokens.$CONTINUE], /continue\b/,
		[Tokens.$PROP, Tokens.$STATEMENT, Tokens.$WHILE], /while\b/,
		Tokens.$BIN, /0[bB][0-1]+/,
		Tokens.$HEX, /0[xX][0-9A-Fa-f]+/,
		Tokens.$FLOAT, /(?:[0-9]*\.)?[0-9]+[eE][+-]?[0-9]+/,
		Tokens.$FLOAT, /[0-9]*\.[0-9]+/,
		Tokens.$INT, /[0-9]+/,
		[Tokens.$PROP, Tokens.$REF, Tokens.$THIS], /this\b/,
		[Tokens.$PROP, Tokens.$REF], /self\b/,
		[Tokens.$PROP, Tokens.$REF, Tokens.$GLOBAL], /global\b/,
		[Tokens.$PROP, Tokens.$REF, Tokens.$ID], /[_$a-zA-Z][_$a-zA-Z0-9]*/,
		Tokens.$SPACES, /[\x0A\x0D\x09\x20]+/,
		Tokens.$LITERAL_START, '{{%',
		Tokens.$LITERAL_END, '%' + '}}',
		Tokens.$AST_START, '{{#',
		Tokens.$AST_END, '#}}',
		Tokens.$CMT_START, '{{*',
		Tokens.$CMT_END, '*}}',
		Tokens.$BLOCK_END, isDevVersion ? /\}\}(?:\*\/)?/ : '}}',
		Tokens.$BLOCK_START, isDevVersion ? /(?:\/\*)?\{\{/ : '{{',
		Tokens.$METHOD, '->',
		Tokens.$ARROW, '=>',
		Tokens.$NEQ, '!=',
		Tokens.$OR, '||',
		Tokens.$AND, '&&',
		Tokens.$BNOT, '~',
		Tokens.$BLS, '<<',
		Tokens.$BRS, '>>',
		Tokens.$BXOR, '^',
		Tokens.$BOR, '|',
		Tokens.$BAND, '&',
		Tokens.$NOT, '!',
		Tokens.$SUPPRESS, '@',
		Tokens.$DQUOTE, '"',
		Tokens.$SQUOTE, "'",
		Tokens.$EQ, '=',
		Tokens.$MOD, '%',
		Tokens.$COLON, ':',
		Tokens.$COMMA, ',',
		Tokens.$QUERY, '?',
		Tokens.$LE, '<=',
		Tokens.$GE, '>=',
		Tokens.$LT, '<',
		Tokens.$GT, '>',
		Tokens.$DOT, '.',
		Tokens.$MINUS, '-',
		Tokens.$PLUS, '+',
		Tokens.$STAR, '*',
		Tokens.$SLASH, '/',
		Tokens.$LPAREN, '(',
		Tokens.$RPAREN, ')',
		Tokens.$LBRACKET, '[',
		Tokens.$RBRACKET, ']'
	)));
}

function arrayExpression(lex) {

	var key, value,
		counter = 0,
		values = {},
		isArray = false,
		isObject = false,
		result = [Constants.AST_ARRAY];

	do {

		while (lex.nextToken(Tokens.$COMMA));
		if (lex.testToken(Tokens.$RBRACKET)) break;

		if (key = lex.nextToken([Tokens.$PROP, Tokens.$INT], Tokens.$COLON)) {
			key = key[0].value;
			value = startExpression(lex);
		}

		else if (Utils.$isString(key = startExpression(lex)) && lex.nextToken(Tokens.$COLON)) {
			value = startExpression(lex);
		}

		else {
			value = key;
			key = 0;
		}



		if (key === 0) {
			if (isObject) parserException(lex, E_MIXED_ARRAY_MAP);
			isArray = true;
			result.push(value, counter++);
		} else {
			if (isArray) parserException(lex, E_MIXED_ARRAY_MAP);
			isObject = true;
			if (values.hasOwnProperty(key)) {
				result[values[key]] = value;
			} else {
				values[key] = result.length;
				result.push(value, key);
			}
		}
	} while (lex.nextToken(Tokens.$COMMA));
	if (!lex.nextToken(Tokens.$RBRACKET)) parserException(lex);
	return result;
}

function regexpLiteral(lex) {
	var fragment, result = '', group = false;
	for (;;) {
		fragment = lex.nextChar();
		if (!group && fragment === '/') try {
			fragment = lex.setIgnored().nextToken(Tokens.$PROP);
			RegExp(result, fragment = fragment ? fragment.value : '');
			result = [Constants.AST_REGEXP, result];
			if (fragment) result.push(fragment);
			return result;
		} catch (exception) { parserException(lex, exception.message); }
		if (fragment === '\\') result += '\\', fragment = lex.nextChar();
		else if (fragment === '[') group = true;
		else if (fragment === ']') group = false;
		if ([lex.$EOF, '\x0A', '\x0D'].indexOf(fragment) !== -1)
			parserException(lex, E_UNTERMINATED_REGEXP(result));
		result += fragment;
	}
}

function stringLiteral(lex) {
	var fragment, result = '', start = lex.nextToken().value;
	for (lex = lex.setIgnored(); fragment = lex.nextToken();) {
		if (fragment.type === lex.$EOF)
			parserException(lex, E_UNTERMINATED_STRING(start + result + start));
		else if ((fragment = fragment.value) === start)
			return escapeStringLiteral(result);
		else if (fragment === '\\')
			result += '\\' + lex.nextToken().value;
		else result += fragment;
	}
}

function parenthesizedExpression(lex) {
	var expressionOffset = lex.getOffset(), expression = startExpression(lex);
	return (
		// if there is comma after expression, then rollback and parse it as ARROW
		lex.testToken(Tokens.$COMMA) ? macroExpression(lex.setOffset(expressionOffset - 1)) :
		!lex.nextToken(Tokens.$RPAREN) ? parserException(lex) :
		// if there is arrow after expression, then rollback and parse it as ARROW
		lex.testToken(Tokens.$ARROW) ? macroExpression(lex.setOffset(expressionOffset - 1)) :
		expression
	);
}

function referenceExpression(lex) {
	var refName = lex.nextToken().value;
	return ctx.getVar(refName) || [].concat(Constants.AST_CALL, refName, parseArgumentList(lex), [[Constants.AST_GLOBAL]]);
}

function primaryExpression(lex) {
	return (
		lex.nextToken(Tokens.$NULL) ? null :
		lex.nextToken(Tokens.$TRUE) ? true :
		lex.nextToken(Tokens.$FALSE) ? false :
		lex.nextToken(Tokens.$SLASH) ? regexpLiteral(lex) :
		lex.nextToken(Tokens.$AST_START) ? astStatement(lex) :
		lex.nextToken(Tokens.$UNDEFINED) ? [Constants.AST_UNDEFINED] :
		lex.nextToken(Tokens.$LITERAL_START) ? literalStatement(lex) :
		lex.nextToken(Tokens.$LBRACKET) ? arrayExpression(lex) :
		lex.nextToken(Tokens.$BLOCK_START) ? nodesStatement(lex, true) :
		lex.nextToken(Tokens.$THIS) ? [Constants.AST_THIS] :
		lex.nextToken(Tokens.$GLOBAL) ? [Constants.AST_GLOBAL] :
		lex.testToken([Tokens.$SQUOTE, Tokens.$DQUOTE]) ? stringLiteral(lex) :
		lex.testToken(Tokens.$INT) ? parseInt(lex.nextToken().value, 10) :
		lex.testToken(Tokens.$BIN) ? parseInt(lex.nextToken().value.slice(2), 2) :
		lex.testToken(Tokens.$HEX) ? parseInt(lex.nextToken().value.slice(2), 16) :
		lex.testToken(Tokens.$FLOAT) ? parseFloat(lex.nextToken().value) :
		lex.testToken(Tokens.$REF) ? referenceExpression(lex) :
		lex.nextToken(Tokens.$LPAREN) ? parenthesizedExpression(lex) :
		parserException(lex)
	);
}

function memberExpression(lex) {
	var result = primaryExpression(lex);

	for (;;) if (lex.nextToken(Tokens.$DOT)) {
		result = [Constants.AST_CALL, Constants.RTTI_M_GET, (lex.nextToken(Tokens.$PROP) || parserException(lex)).value, result];
	}

	else if (lex.nextToken(Tokens.$LBRACKET)) {
		result = [Constants.AST_CALL, Constants.RTTI_M_GET].concat(parseExpressionList(lex), [result]);
		if (!lex.nextToken(Tokens.$RBRACKET)) parserException(lex);
	}

	else if (lex.nextToken(Tokens.$METHOD)) {
		result = [Constants.AST_CALL, (lex.nextToken(Tokens.$PROP) || parserException(lex)).value].concat(parseArgumentList(lex), [result]);
	}

	else if (lex.testToken(Tokens.$LPAREN)) {
		result = [Constants.AST_CALL, Constants.RTTI_M_CALL].concat(parseArgumentList(lex), [result]);
	}

	else return result;
}

function unaryExpression(lex) {
	return (
		// OPTIMIZATION: do not produce AST node in case of -NUMBER
		lex.nextToken(Tokens.$MINUS) ? (Utils.$isNumber(lex = unaryExpression(lex)) ? -lex : [Constants.AST_USUB, lex]) :
		lex.nextToken(Tokens.$NOT) ? [Constants.AST_NOT, unaryExpression(lex)] :
		lex.nextToken(Tokens.$BNOT) ? [Constants.AST_BNOT, unaryExpression(lex)] :
		memberExpression(lex)
	);
}

function multiplicativeExpression(lex) {
	for (var result = unaryExpression(lex);
		lex.nextToken(Tokens.$STAR) && (result = [Constants.AST_MUL, result]) ||
		lex.nextToken(Tokens.$SLASH) && (result = [Constants.AST_DIV, result]) ||
		lex.nextToken(Tokens.$MOD) && (result = [Constants.AST_MOD, result]);
		result.push(unaryExpression(lex)));
	return result;
}

function additiveExpression(lex) {
	for (var result = multiplicativeExpression(lex);
		lex.nextToken(Tokens.$PLUS) && (result = [Constants.AST_ADD, result]) ||
		lex.nextToken(Tokens.$MINUS) && (result = [Constants.AST_SUB, result]);
		result.push(multiplicativeExpression(lex)));
	return result;
}

function bitwiseShiftExpression(lex) {
	for (var result = additiveExpression(lex);
		lex.nextToken(Tokens.$BLS) && (result = [Constants.AST_BLS, result]) ||
		lex.nextToken(Tokens.$BRS) && (result = [Constants.AST_BRS, result]);
		result.push(additiveExpression(lex)));
	return result;
}

function relationalExpression(lex) {
	for (var result = bitwiseShiftExpression(lex);
		lex.nextToken(Tokens.$LE) && (result = [Constants.AST_LE, result]) ||
		lex.nextToken(Tokens.$GE) && (result = [Constants.AST_GE, result]) ||
		lex.nextToken(Tokens.$LT) && (result = [Constants.AST_LT, result]) ||
		lex.nextToken(Tokens.$GT) && (result = [Constants.AST_GT, result]);
		result.push(bitwiseShiftExpression(lex)));
	return result;
}

function equalityExpression(lex) {
	for (var result = relationalExpression(lex);
		lex.nextToken(Tokens.$EQ) && (result = [Constants.AST_EQ, result]) ||
		lex.nextToken(Tokens.$NEQ) && (result = [Constants.AST_NEQ, result]);
		result.push(relationalExpression(lex)));
	return result;
}

function bitwiseANDExpression(lex) {
	for (var result = equalityExpression(lex);
		lex.nextToken(Tokens.$BAND) && (result = [Constants.AST_BAND, result]);
		result.push(equalityExpression(lex)));
	return result;
}

function bitwiseXORExpression(lex) {
	for (var result = bitwiseANDExpression(lex);
		lex.nextToken(Tokens.$BXOR) && (result = [Constants.AST_BXOR, result]);
		result.push(bitwiseANDExpression(lex)));
	return result;
}

function bitwiseORExpression(lex) {
	for (var result = bitwiseXORExpression(lex);
		lex.nextToken(Tokens.$BOR) && (result = [Constants.AST_BOR, result]);
		result.push(bitwiseXORExpression(lex)));
	return result;
}

function logicalANDExpression(lex) {
	for (var result = bitwiseORExpression(lex);
		lex.nextToken(Tokens.$AND) && (result = [Constants.AST_AND, result]);
		result.push(bitwiseORExpression(lex)));
	return result;
}

function logicalORExpression(lex) {
	for (var result = logicalANDExpression(lex);
		lex.nextToken(Tokens.$OR) && (result = [Constants.AST_OR, result]);
		result.push(logicalANDExpression(lex)));
	return result;
}

function ternaryExpression(lex) {

	for (var result = logicalORExpression(lex);
		lex.nextToken(Tokens.$QUERY) && (result = [Constants.AST_TERNARY, result, startExpression(lex)]);
		lex.nextToken(Tokens.$COLON) && result.push(startExpression(lex)));

	// OPTIMIZATION: rewrite (!cond ? expr1 : expr2) INTO (cond ? expr2 : expr1)
	if (
		Utils.$isArray(result) && result[0] === Constants.AST_TERNARY &&
		Utils.$isArray(result[1]) && result[1][0] === Constants.AST_NOT
	) {
		result[1] = result[1][1];
		if (result.length === 3) result.push([Constants.AST_UNDEFINED]);
		result[3] = [result[2], result[2] = result[3]][0];
	}

	return result;
}

function macroExpression(lex) {

	var paramName, body = [Constants.AST_NODELIST],
		result = [Constants.AST_MACRO, null, body],
		params = parseMacroParameters(lex, true);

	if (!lex.nextToken(Tokens.$ARROW)) parserException(lex);

	ctx.scopeEnter();
	ctx.macroEnter(result);
	ctx.setVar('self');

	if (params.length) {
		result.push(params.length / 2);
		while (params.length) {
			ctx.setVar(params.shift());
			if (paramName = params.shift()) {
				Array.prototype.push.apply(result, paramName);
			}
		}
	}

	body.push([Constants.AST_RETURN, startExpression(lex)]);

	ctx.macroExit();
	ctx.scopeExit();
	result[1] = extractReferences(body);

	return result;
}

function startExpression(lex) {
	return (
		lex.testToken(Tokens.$ARROW) ||
		lex.testToken(Tokens.$ID, Tokens.$ARROW) ||
		lex.testToken(Tokens.$LPAREN, Tokens.$RPAREN) ||
		lex.testToken(Tokens.$LPAREN, Tokens.$ID, Tokens.$COMMA) ||
		lex.testToken(Tokens.$LPAREN, Tokens.$ID, Tokens.$RPAREN, Tokens.$ARROW) ?
		macroExpression(lex) : ternaryExpression(lex)
	);
}

function expressionStatement(lex) {
	if (lex.nextToken(Tokens.$BLOCK_END)) return [T_NOP];
	var expression = startExpression(lex);
	return lex.nextToken(Tokens.$BLOCK_END) ? expression : parserException(lex);
}

function ifStatement(lex) {
	var result = [Constants.AST_IF];
	do {
		result.push(startExpression(lex));
		if (!lex.nextToken(Tokens.$BLOCK_END)) parserException(lex);
		ctx.scopeEnter();
		result.push(nodeListStatement(lex), result.pop());
		ctx.scopeExit();
	} while (lex.nextToken(Tokens.$ELSEIF));
	if (lex.nextToken(Tokens.$ELSE)) {
		if (!lex.nextToken(Tokens.$BLOCK_END))
			parserException(lex);
		ctx.scopeEnter();
		result.push(nodeListStatement(lex))
		ctx.scopeExit();
	}
	return (
		lex.nextToken(Tokens.$SLASH, Tokens.$IF, Tokens.$BLOCK_END) ?
		result : parserException(lex)
	);
}

function varStatement(lex) {
	var name, value, result = [T_ARRAY];

	if (!lex.testToken(Tokens.$ID, [Tokens.$ARROW, Tokens.$LPAREN, Tokens.$EQ])) {
		name = (lex.nextToken(Tokens.$ID) || parserException(lex)).value;
		if (!lex.nextToken(Tokens.$BLOCK_END)) parserException(lex);
		name = ctx.setVar(name, value = nodesStatement(lex));
		if (name >= 0) result = [Constants.AST_VAR, value, name];
		if (!lex.nextToken(Tokens.$SLASH, Tokens.$VAR)) parserException(lex);
	}

	else do {
		name = ctx.setVar((lex.nextToken(Tokens.$ID) || parserException(lex)).value, value = (
			lex.nextToken(Tokens.$EQ) ? startExpression(lex) :
			lex.testToken([Tokens.$ARROW, Tokens.$LPAREN]) ? macroExpression(lex) :
			parserException(lex)
		));
		if (name >= 0) result.push([Constants.AST_VAR, value, name]);
	} while (lex.nextToken(Tokens.$COMMA));

	return lex.nextToken(Tokens.$BLOCK_END) ? result : parserException(lex);
}

function suppressStatement(lex) {
	var result = [Constants.AST_SUPPRESS, startExpression(lex)];
	return lex.nextToken(Tokens.$BLOCK_END) ? result : parserException(lex);
}

function whileStatement(lex) {

	var label, result = [Constants.AST_WHILE, null];

	if (!lex.testToken([Tokens.$BLOCK_END, Tokens.$AS]))
		result.push(startExpression(lex));

	if (lex.nextToken(Tokens.$AS)) {
		label = (lex.nextToken(Tokens.$ID) || parserException(lex)).value;
		if (Utils.$isNumber(ctx.loopGet(label))) parserException(lex, E_DUPLICATE_LABEL(label));
	}

	if (!lex.nextToken(Tokens.$BLOCK_END)) parserException(lex);

	ctx.scopeEnter();
	ctx.loopEnter(label);
	ctx.setVar('self');
	result[1] = nodeListStatement(lex);
	ctx.loopExit();
	ctx.scopeExit();

	return (
		lex.nextToken(Tokens.$SLASH, Tokens.$WHILE, Tokens.$BLOCK_END) ?
		result : parserException(lex)
	);
}

function forStatement(lex) {

	var expression, result = [Constants.AST_FOR, null, null, null, null];

	if (expression = lex.nextToken(Tokens.$ID)) {
		expression = expression.value;
		if (lex.nextToken(Tokens.$COLON)) {
			result[1] = expression;
			result[2] = (lex.nextToken(Tokens.$ID) || parserException(lex)).value;
			if (result[1] === result[2]) parserException(lex, E_KEY_VALUE_MUST_DIFFER);
		} else result[2] = expression;
	}


	if (!lex.nextToken(Tokens.$IN)) parserException(lex);

	result[4] = startExpression(lex);

	if (lex.nextToken(Tokens.$AS)) {
		expression = (lex.nextToken(Tokens.$ID) || parserException(lex)).value;
		if (Utils.$isNumber(ctx.loopGet(expression))) parserException(lex, E_DUPLICATE_LABEL(expression));
	} else expression = null;


	if (!lex.nextToken(Tokens.$BLOCK_END)) parserException(lex);

	ctx.scopeEnter();
	ctx.loopEnter(expression);
	ctx.setVar('self');
	result[1] = ctx.setVar(result[1]);
	result[2] = ctx.setVar(result[2]);
	result[3] = nodeListStatement(lex);
	ctx.loopExit();
	ctx.scopeExit();

	while (lex.nextToken(Tokens.$ELSEIF)) {
		expression = startExpression(lex);
		if (!lex.nextToken(Tokens.$BLOCK_END)) parserException(lex);
		ctx.scopeEnter();
		result.push(nodeListStatement(lex), expression);
		ctx.scopeExit();
	}

	if (lex.nextToken(Tokens.$ELSE)) {
		if (!lex.nextToken(Tokens.$BLOCK_END)) parserException(lex);
		ctx.scopeEnter();
		result.push(nodeListStatement(lex));
		ctx.scopeExit();
	}

	return (
		lex.nextToken(Tokens.$SLASH, Tokens.$FOR, Tokens.$BLOCK_END) ?
		result : parserException(lex)
	);
}

function macroStatement(lex) {

	var paramName,
		varName = (lex.nextToken(Tokens.$ID) || parserException(lex)).value,
		result = [Constants.AST_MACRO, null, null],
		params = parseMacroParameters(lex);

	if (!lex.nextToken(Tokens.$BLOCK_END)) parserException(lex);

	ctx.scopeEnter();
	ctx.macroEnter(result);
	ctx.loopEnter();
	ctx.setVar('self');

	if (params.length) {
		result.push(params.length / 2);
		while (params.length) {
			ctx.setVar(params.shift());
			if (paramName = params.shift()) {
				Array.prototype.push.apply(result, paramName);
			}
		}
	}

	result[2] = nodeListStatement(lex);


	ctx.macroExit();
	ctx.loopExit();
	ctx.scopeExit();

	result[1] = extractReferences(result[2]);

	return (
		lex.nextToken(Tokens.$SLASH, Tokens.$MACRO, Tokens.$BLOCK_END) ?
		[Constants.AST_VAR, result, ctx.setVar(varName)] :
		parserException(lex)
	);
}

function returnStatement(lex) {
	var result = [Constants.AST_RETURN];
	if (lex.nextToken(Tokens.$BLOCK_END)) {
		result.push(nodesStatement(lex));
		if (!lex.nextToken(Tokens.$SLASH, Tokens.$RETURN))
			parserException(lex);
	} else result.push(startExpression(lex));
	return lex.nextToken(Tokens.$BLOCK_END) ? result : parserException(lex);
}

function breakContinueStatement(lex, type) {

	if (!ctx.loopGet()) parserException(lex,
		type === Constants.AST_BREAK ?
		E_ILLEGAL_BREAK : E_ILLEGAL_CONTINUE
	);

	var result;

	if (!lex.testToken(Tokens.$BLOCK_END)) {
		if (!(result = lex.nextToken(Tokens.$ID)))
			parserException(lex);
		if (Utils.$isString(result = ctx.loopGet(result.value)))
			parserException(lex, E_UNDEFINED_LABEL(result));
	}

	return (
		lex.nextToken(Tokens.$BLOCK_END) ?
		(result ? [type, result] : [type]) :
		parserException(lex)
	);
}

function templateStatement(lex) {
	return (lex = lex.setIgnored(Tokens.$SPACES)), (
		lex.nextToken(Tokens.$IF) ? ifStatement(lex) :
		lex.nextToken(Tokens.$FOR) ? forStatement(lex) :
		lex.nextToken(Tokens.$VAR) ? varStatement(lex) :
		lex.nextToken(Tokens.$WHILE) ? whileStatement(lex) :
		lex.nextToken(Tokens.$MACRO) ? macroStatement(lex) :
		lex.nextToken(Tokens.$RETURN) ? returnStatement(lex) :
		lex.nextToken(Tokens.$BREAK) ? breakContinueStatement(lex, Constants.AST_BREAK) :
		lex.nextToken(Tokens.$CONTINUE) ? breakContinueStatement(lex, Constants.AST_CONTINUE) :
		lex.nextToken(Tokens.$SUPPRESS) ? suppressStatement(lex) :
		lex.testToken(Tokens.$SLASH, Tokens.$STATEMENT, Tokens.$BLOCK_END) ? [T_BREAK] :
		lex.testToken(Tokens.$STATEMENT) ? [T_BREAK] :
		expressionStatement(lex)
	);
}

function literalStatement(lex) {
	var result = '', lex = lex.setIgnored();
	while (!lex.testToken([lex.$EOF, Tokens.$LITERAL_END])) result += lex.nextToken().value;
	return lex.nextToken(Tokens.$LITERAL_END) ? result : parserException(lex);
}

function commentStatement(lex) {
	while (!lex.testToken([lex.$EOF, Tokens.$CMT_END])) lex.nextToken();
	return lex.nextToken(Tokens.$CMT_END) ? [T_NOP] : parserException(lex);
}

function astStatement(lex) {
	var context = ctx, lex = lex.setIgnored(), result = [Constants.AST_NODELIST];
	ctx = new Context(ctx.baseURI);
	while (!lex.testToken([lex.$EOF, Tokens.$AST_END]) && parseStartStatement(lex, result));
	if (!lex.nextToken(Tokens.$AST_END)) parserException(lex);
	result = Optimizer(result);
	ctx = context;
	return [Constants.AST_TREE, result];
}

function nodesStatement(lex, nested) {
	var lex = lex.setIgnored(), result = [Constants.AST_NODES];
	ctx.scopeEnter(), ctx.loopEnter();
	while ((!nested || !lex.testToken(Tokens.$BLOCK_END)) && parseStartStatement(lex, result));
	ctx.loopExit(), ctx.scopeExit();
	return (
		!nested || lex.nextToken(Tokens.$BLOCK_END) ?
		Optimizer.compressNodeLists(result) : parserException(lex)
	);
}

function nodeListStatement(lex) {
	var lex = lex.setIgnored(), result = [Constants.AST_NODELIST];
	while (parseStartStatement(lex, result));
	return Optimizer.compressNodeLists(result);
}

module.exports = function(template, baseURI) {
	var lex = getTokenizer().init(template);
	ctx = new Context(baseURI);
	template = nodeListStatement(lex);
	return lex.testToken(lex.$EOF) ? Optimizer(template) : parserException(lex);
};
//%}}