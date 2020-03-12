var FS = require('fs'),
	Colors = require('colors'),
	Path = require('path'),
	Minimist = require('minimist'),
	commandLine = Minimist(process.argv.slice(2)),
	histonePath = (
		typeof commandLine.histone === 'string' ?
		Path.resolve(process.cwd(), commandLine.histone) :
		Path.resolve(__dirname, '../src/Histone')
	);

var message, exitCode = 0;

function getHistone() {
	var cache = require.cache;
	for (var key in cache) {
		// if (cache.hasOwnProperty(key)) {
			delete cache[key];
		// }
	}
	return require(histonePath);
}

function forAsync(iterator, begin, end, step) {

	if (arguments.length < 3) end = Infinity;

	if (!begin) begin = 0;
	if (!step) step = 1;

	var calls = 0,
		idle = true,

		it = function() {
			calls += 1;
			if (idle) {
				idle = false;

				while (calls > 0) {
					calls -= 1;

					iterator((it.iteration += step) <= end ? it : null, it.iteration);

				}

				idle = true;
			}
		};

	it.iteration = -step + begin;


	it();
}

function asyncForEach(array, retn, retf) {
	forAsync(function(iterator, iteration) {
		if (!iterator) retf();
		else retn(array[iteration], iterator);
	}, 0, array.length - 1);
}

function getTestSuite(retn, retf) {

	function getNextFile(path, retf) {
		FS.readdir(path, function(error, files) {
			asyncForEach(files, function(file, next) {
				FS.lstat(file = Path.resolve(path, file), function(error, stats) {
					if (stats.isDirectory())
						getNextFile(file, next);
					else if (file.slice(-3) === '.js')
						retn(file, next);
					else next();
				});
			}, retf);
		});
	}

	var startPath = commandLine.suite;
	if (typeof startPath === 'string')
		startPath = Path.resolve(process.cwd(), startPath);
	else startPath = Path.resolve(__dirname, 'tests');

	FS.lstat(startPath, function(error, stats) {
		if (error) retf();
		else if (stats.isDirectory())
			getNextFile(startPath, retf);
		else retn(startPath, retf);
	});
}

function printResult(success) {
	console.info(success ? Colors.green(message) : Colors.red(message));
	if (!success) {
		exitCode = 1;
		process.exit(1);
	}
}

// ordinary exit will result with error
process.on('beforeExit', printResult);

getTestSuite(function(testSuitePath, ret) {

	console.info('');
	console.info('[ SUITE ]', Colors.underline(testSuitePath));
	console.info('');

	var testSuite = require(testSuitePath);

	if (!(testSuite instanceof Array)) testSuite = [testSuite];

	// if (testSuite instanceof Function) testSuite = [testSuite];
	// if (!(testSuite instanceof Array)) nextTestSuite();
	asyncForEach(testSuite, function(testCase, nextTestCase) {

		if (typeof testCase === 'string') {
			message = testCase;
			try {
				getHistone()(testCase).render(function(result) {
					printResult(!!result);
					nextTestCase();
				});
			}

			catch (exception) {
				printResult();
				nextTestCase();
			}
		}


		else if (testCase instanceof Function) {
			message = testCase.toString();


			try {
				testCase(getHistone(), function(result) {
					// var result = Array.prototype.every.call(arguments, result => !!result);
					printResult(!!result);
					nextTestCase();
				}, histonePath);
			}

			catch (exception) {
				printResult();
				nextTestCase();
			}
		}

		else nextTestCase();



	}, ret);


}, function() {
	process.exit(exitCode);
});