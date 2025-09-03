var FS = require('fs-extra'),
	Path = require('path'),
	HistoneVersion = require('../package.json').version,
	{ minify } = require('terser'),
	commandLine = require('minimist')(process.argv.slice(2)),
	resolve = Path.resolve.bind(Path, __dirname),
	Constants = require('../src/Constants.js'),
		{ rollup } = require('rollup'),
	commonjs = require('@rollup/plugin-commonjs'),
	resolvex  = require( '@rollup/plugin-node-resolve' ),

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
	cmdDefaultLang = getStringArgument('defaultLang'),
	cmdLanguages = [].concat(commandLine.lang || []),
	cmdExcludeParser = getBooleanArgument('exclude-parser'),
	cmdTarget = Path.resolve(process.cwd(), getStringArgument('target') || resolve('../Histone.js')),
	cmdFormat = getStringArgument('format'),
	cmdFormat = formatTemplates.hasOwnProperty(cmdFormat) ? cmdFormat : 'commonjs';


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
	copySourceTree(SRC_DIR, async() => {

	const bundle = await rollup({
			input: resolve('script/entry.js'),  // твоя точка входа
    plugins: [
      resolvex(),
      commonjs(),
    ]
  })


		const { output } = await bundle.generate({
			format: 'cjs',
			sourcemap: false
		});



		let result = output[0].code;

	
		 result = (await minify(result, {
    ecma: 2020,
    compress: true,
    mangle: true,
  })).code;


  

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

		// });

	}, {
		VERSION: HistoneVersion,
		HAS_PARSER: !cmdExcludeParser,
		LANGUAGES: languages,
		LANGUAGE: language
	});
});