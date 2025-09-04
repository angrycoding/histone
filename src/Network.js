import Utils from './Utils.js';
import RTTI from './RTTI.js';
import Parser from './Parser.js';
import Processor from './Processor.js';
import Constants from './Constants.js';

var
	RTTI_R = Constants.RTTI_R,

	RTTI_R_JS = Constants.RTTI_R_JS,
	RTTI_R_STRING = Constants.RTTI_R_STRING,
	RTTI_R_HISTONE = Constants.RTTI_R_HISTONE,

	HistoneArray = RTTI.$Array,
	RESOURCE_LOADER = null;

var RESOURCE_CACHE = {},
	CACHE_PROMISES = {},
	CACHE_ENABLED = true;


var CACHE_TEXT = 0,
	CACHE_JSON = 1,
	CACHE_TEMPLATE = 2;

var CACHE_STATE_AST = 1,
	CACHE_STATE_RESULT = 2;

function setCache(enabled) {
	CACHE_ENABLED = Boolean(enabled);
}

function clearCache() {
	RESOURCE_CACHE = {};
}

function resolveCache(key, processor, done, doCache) {

	var next, callArgs = [];

	if (doCache) callArgs = (
		RESOURCE_CACHE.hasOwnProperty(key) ?
		RESOURCE_CACHE[key] :
		RESOURCE_CACHE[key] = []
	);

	else if (RESOURCE_CACHE.hasOwnProperty(key)) {
		delete RESOURCE_CACHE[key];
	}


	Utils.$for(function(iterator) {

		if (!next) next = [function() {
			callArgs = Array.prototype.slice.call(arguments);
			if (doCache) RESOURCE_CACHE[key] = callArgs;
			iterator();
		}, done];

		processor.apply(null, next.concat(callArgs));

	});
}




function aSorter(a, b) {
	return (
		(a instanceof RTTI_R ? 1 : a instanceof Processor ? 2 : 3) -
		(b instanceof RTTI_R ? 1 : b instanceof Processor ? 2 : 3)
	);
}


function getNoCacheState(requestProps) {
	return (
		requestProps instanceof HistoneArray &&
		requestProps.has('cache') &&
		!RTTI.$toBoolean(requestProps.get('cache'))
	);
}

function mergeQueryString(resourceURI, queryParams) {

	resourceURI = Utils.$parseURI(resourceURI);

	var queryString = resourceURI.query, outputQuery = new HistoneArray();

	if (typeof queryString === 'string') {
		queryString.replace(/([^?=&]+)(=([^&]*))?/g, function($0, $1, $2, $3) {
			outputQuery.set($3 || '', $1);
		});
	}

	if (!(queryParams instanceof HistoneArray)) {
		queryParams = [new HistoneArray(), RTTI.$toString(queryParams)];
		if (queryParams[1]) queryParams[0].set('', queryParams[1]);
		queryParams = queryParams[0];
	}


	resourceURI.query = outputQuery.concat(queryParams).map(function(value, key) {
		return key + '=' + encodeURIComponent(value);
	}).getValues().join('&');


	return Utils.$formatURI(resourceURI);
}

function filterRequestProps(resourceURI, requestProps, noCache, ret) {

	var result = {
		'method': 'GET',
		'cache': !noCache
	};

	if (requestProps instanceof HistoneArray) {

		if (requestProps.has('method')) {
			var method = RTTI.$toString(requestProps.get('method')).toUpperCase();
			result.method = ['GET', 'POST'].indexOf(method) === -1 ? 'GET' : method;
		}

		if (requestProps.has('data')) {
			if (result.method === 'POST')
				result.data = RTTI.$toJavaScript(requestProps.get('data'));
			else resourceURI = mergeQueryString(resourceURI, requestProps.get('data'));
		}


	}

	ret(resourceURI, result);


}

function setResourceLoader(resourceLoader) {
	if (!Utils.$isFunction(resourceLoader)) return;
	RESOURCE_LOADER = resourceLoader;
}

function loadResource(resourceURI, ret, noCache, props) {
	if (!Utils.$isFunction(RESOURCE_LOADER)) ret();
	else filterRequestProps(resourceURI, props, noCache, function(resourceURI, props) {
		RESOURCE_LOADER(resourceURI, ret, props);
	});
}

function loadText(requestURI, ret) {

	if (!Utils.$isFunction(ret)) return;
	if (!Utils.$isString(requestURI)) return ret();

	var requestProps, scope, args = Array.prototype.slice.call(arguments, 2).sort(aSorter);

	if (args[0] instanceof RTTI_R) args.shift();
	if (args[0] instanceof Processor) {
		scope = args.shift();
		requestURI = Utils.$resolveURI(requestURI, scope.baseURI);
		if (!Utils.$isString(requestURI)) return ret();
	}

	if (args.length) requestProps = RTTI.$toHistone(args.shift());

	var noCache = getNoCacheState(requestProps);
	getCache([CACHE_TEXT, requestURI], function(retn, retf, result, state) {
		if (state) retf(result, noCache ? Constants.RTTI_V_DIRTY : Constants.RTTI_V_CLEAN);
		else loadResource(requestURI, function(result) {
			retn(Utils.$isString(result) ? result : undefined, true);
		}, noCache, requestProps);
	}, ret, noCache);
}

function loadJSON(requestURI, ret) {

	if (!Utils.$isFunction(ret)) return;
	if (!Utils.$isString(requestURI)) return ret();

	var requestProps, scope, type = RTTI_R_HISTONE,
		args = Array.prototype.slice.call(arguments, 2).sort(aSorter);

	if (args[0] instanceof RTTI_R) type = args.shift();
	if (args[0] instanceof Processor) {
		scope = args.shift();
		requestURI = Utils.$resolveURI(requestURI, scope.baseURI);
		if (!Utils.$isString(requestURI)) return ret();
	}

	if (args.length) requestProps = RTTI.$toHistone(args.shift());

	var noCache = getNoCacheState(requestProps);
	getCache([CACHE_JSON, requestURI], function(retn, retf, result, state) {
		if (state) retf(result, noCache ? Constants.RTTI_V_DIRTY : Constants.RTTI_V_CLEAN);
		else loadResource(requestURI, function(result) {
			if (Utils.$isString(result)) try {
				result = result.replace(/^\s*([$A-Z_][0-9A-Z_$]*)?\s*\(\s*/i, '');
				result = result.replace(/\s*\)\s*(;\s*)*\s*$/, '');
				result = JSON.parse(result);
			} catch (exception) { result = undefined; }
			retn(RTTI.$toHistone(result), true);
		}, noCache, requestProps);
	}, function(result, state) {
		if (type === RTTI_R_JS)
			result = RTTI.$toJavaScript(result);
		ret(result, state);
	}, noCache);
}




function getCache(key, retn, retf, noCache) {

	var doCache = (CACHE_ENABLED && !noCache);

	if (CACHE_PROMISES.hasOwnProperty(key = JSON.stringify(key)))
		return CACHE_PROMISES[key].push(retn, retf, doCache);





	var promises = CACHE_PROMISES[key] = [retn, retf, doCache];
	Utils.$for(function(next) {

		if (promises.length) {

			retn = promises.shift();
			retf = promises.shift();
			doCache = promises.shift();

			resolveCache(key, retn, function() {
				retf.apply(this, arguments);
				next();
			}, doCache);



		} else delete CACHE_PROMISES[key];


	});

}


function loadTemplate(requestURI, ret) {

	if (!Utils.$isFunction(ret)) return;
	if (!Utils.$isString(requestURI)) return ret();

	var thisObj, scope, type = RTTI_R_HISTONE,
		args = Array.prototype.slice.call(arguments, 2).sort(aSorter);

	if (args[0] instanceof RTTI_R) type = args.shift();
	if (args[0] instanceof Processor) {
		scope = args.shift();
		requestURI = Utils.$resolveURI(requestURI, scope.baseURI);
		if (!Utils.$isString(requestURI)) return ret();
	}

	if (args.length) thisObj = RTTI.$toHistone(args.shift());

	getCache([CACHE_TEMPLATE, requestURI], function(retn, retf, cacheState, result, state) {
		switch (cacheState) {

			case CACHE_STATE_RESULT: retf(result, state); break;

			case CACHE_STATE_AST:
				new Processor(requestURI, thisObj, scope ? scope.shadowObj : undefined)
				.process(result, function(result, state) {
					if (!(state & Constants.RTTI_V_DIRTY))
						retn(CACHE_STATE_RESULT, result, state);
					else retf(result, state);
				});
				break;

			default: loadResource(requestURI, function(template) {
				if (!Utils.$isString(template) && !(template instanceof Array)) {
					template = undefined;
				} else template = Parser(template, requestURI);
				retn(CACHE_STATE_AST, template);
			});

		}
	}, function(result, state) {
		// console.info(result, state)
		if (type === RTTI_R_JS)
			result = RTTI.$toJavaScript(result);
		else if (type === RTTI_R_STRING)
			result = RTTI.$toString(result);
		ret(result, state);
	});
}


export default {
	$setCache: setCache,
	$clearCache: clearCache,
	$loadText: loadText,
	$loadJSON: loadJSON,
	$require: loadTemplate,
	$setResourceLoader: setResourceLoader
};