var FS = require('fs-extra'),
	Path = require('path'),
	HistoneVersion = require('../package.json').version,
	Compiler = require('google-closure-compiler').compiler,
	commandLine = require('minimist')(process.argv.slice(2)),
	resolve = Path.resolve.bind(Path, __dirname),
	Constants = require('../src/Constants.js'),
	HISTONE_PATH = resolve('../src/Histone.js'),
	Histone = require(HISTONE_PATH),
	TMP_DIR = resolve('../tmp'),
	SRC_DIR = resolve('../src'),
	cleanup = (function() { return FS.removeSync(TMP_DIR), arguments.callee; })(),

	getBooleanArgument = function(name) {
		if (!commandLine.hasOwnProperty(name)) return false;
		if ((name = commandLine[name]) instanceof Array) name = name.pop();
		return (['yes', 'true'].indexOf(String(name).toLowerCase()) !== -1);
	},

	getStringArgument = function(name) {
		if (!commandLine.hasOwnProperty(name)) return '';
		if ((name = commandLine[name]) instanceof Array) name = name.pop();
		if (typeof name === 'boolean') return '';
		return String(name);
	},

	// format templates
	formatTemplates = {
		'amd': resolve('templates/amd.tpl'),
		'global': resolve('templates/global.tpl'),
		'commonjs': resolve('templates/commonjs.tpl'),
		'krang': resolve('templates/krang.tpl'),
		'es6module': resolve('templates/es6module.tpl'),
	},

	// all possible command line arguments
	cmdBeVerbose = getBooleanArgument('verbose'),
	cmdDefaultLang = getStringArgument('defaultLang'),
	cmdLanguages = [].concat(commandLine.lang || []),
	cmdExcludeParser = getBooleanArgument('exclude-parser'),
	cmdExperimentalFeatures = getBooleanArgument('experimental'),
	cmdTarget = Path.resolve(process.cwd(), getStringArgument('target') || resolve('../Histone.js')),
	cmdFormat = getStringArgument('format'),
	cmdFormat = formatTemplates.hasOwnProperty(cmdFormat) ? cmdFormat : 'commonjs',

	// compiler options array
	compilerOptions = [
		'--charset', 'UTF-8',
		'--warning_level', 'VERBOSE',
		'--jscomp_off', 'checkRegExp',
		'--jscomp_off', 'uselessCode',
		'--jscomp_off', 'duplicate',
		'--jscomp_off', 'suspiciousCode',
		'--jscomp_off', 'checkTypes',
		'--jscomp_off', 'globalThis',
		'--jscomp_off', 'deprecatedAnnotations',
		'--jscomp_off', 'es5Strict',
		'--jscomp_error', 'missingPolyfill',
		'--rewrite_polyfills', 'false',
		'--assume_function_wrapper',
		'--formatting', 'SINGLE_QUOTES',
		'--use_types_for_optimization',
		'--compilation_level', 'ADVANCED',
		'--externs', resolve('script/externs.js'),
		'--process_common_js_modules', resolve('script/entry.js')
	];

function getLanguages(ret) {

	var result = {};

	forEachParallel(cmdLanguages, function(locale, ret) {
		FS.stat(locale = Path.resolve(process.cwd(), String(locale)), function(error, stats) {
			if (error || !stats.isFile()) return ret();
			var localeId = Path.basename(locale, Path.extname(locale));
			try {
				if ((locale = require(locale)) instanceof Function)
					result[localeId] = locale(Constants);
			}
			catch (e) {}
			finally { ret(); }
		});
	}, function() {
		ret(result, result.hasOwnProperty(cmdDefaultLang) ? cmdDefaultLang : Object.keys(result)[0] || null);
	});
}


require.main.children.find((module) => module.id === HISTONE_PATH).children.forEach(function(module) {
	module.children.forEach(arguments.callee);
	if ((module = module.id).indexOf(SRC_DIR) === -1) {
		// console.info(module)
		compilerOptions.push('--process_common_js_modules', module);
	}
});

Histone.setResourceLoader(function(requestURI, ret) {
	FS.readFile(requestURI, 'UTF-8', function(error, template) {
		ret(template);
	});
});

function forEachParallel(collection, iterator, ret) {

	var length = collection.length,
		index = length,
		callback = function() {
			if (!--length) ret();
		};

	if (length) while (index--)
		iterator(collection[index], callback, index);
	else ret();
}

function copySourceTree(path, ret, defines) {
	FS.readdir(path, function(error, files) {
		forEachParallel(files, function(file, ret) {
			FS.lstat(file = Path.resolve(path, file), function(error, stats) {

				if (stats.isDirectory()) copySourceTree(file, ret, defines);

				else if (file.slice(-3) !== '.js') ret();

				else FS.copy(file, file = Path.resolve(TMP_DIR, Path.relative(SRC_DIR, file)), function() {
					Histone.require(file, function(contents) {
						FS.writeFile(file, contents, function() {
							// console.info(file)
							compilerOptions.push('--process_common_js_modules', file);
							ret();
						});
					}, defines);
				});

			});
		}, ret);
	});
}

process.on('exit', cleanup);
process.on('SIGINT', cleanup);
process.on('uncaughtException', cleanup);

getLanguages(function(languages, language) {
	copySourceTree(SRC_DIR, function() {

		// console.info(compilerOptions);
		// throw 'x';

		new Compiler(compilerOptions).run(function(exitCode, result, errorMsg) {

			if (exitCode || cmdBeVerbose)
				console.info(errorMsg);

			if (exitCode) process.exit(exitCode);

			console.info(result)

			Histone.require(formatTemplates[cmdFormat], function(result) {
				FS.writeFile(cmdTarget, result, function() {
					process.exit(0);
				});
			}, {
				contents: result,
				version: HistoneVersion,
				template: cmdFormat,
				languages: languages,
				language: language
			}, Histone.R_STRING);

		});

	}, {
		VERSION: HistoneVersion,
		HAS_PARSER: !cmdExcludeParser,
		EXPERIMENTAL: cmdExperimentalFeatures,
		LANGUAGES: languages,
		LANGUAGE: language
	});
});