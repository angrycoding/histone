var Utils = require('./Utils'),
	RTTI = require('./RTTI'),
	Constants = require('./Constants'),
	Processor = require('./Processor'),
	RTTI_R = Constants.RTTI_R,
	RTTI_R_JS = Constants.RTTI_R_JS,
	RTTI_R_STRING = Constants.RTTI_R_STRING,
	RTTI_R_HISTONE = Constants.RTTI_R_HISTONE;

function Template(templateAST, baseURI) {
	this.baseURI = baseURI;
	this.templateAST = templateAST;
}

/** @expose */
Template.prototype.getBaseURI = function() {
	return this.baseURI;
};

/** @expose */
Template.prototype.getAST = function() {
	return this.templateAST;
};


function aSorter(a, b) {
	return (
		(a instanceof RTTI_R ? 1 : a instanceof Function ? 2 : 3) -
		(b instanceof RTTI_R ? 1 : b instanceof Function ? 2 : 3)
	);
}


/** @expose */
Template.prototype.render = function() {

	var ret, type = RTTI_R_HISTONE,
		args = Array.prototype.slice.call(arguments).sort(aSorter);


	if (args[0] instanceof RTTI_R) type = args.shift();
	if (args[0] instanceof Function) ret = args.shift();

	new Processor(this.baseURI, args[0], args[1])
	.process(this.templateAST, function(result, state) {

		if (type === RTTI_R_JS)
			result = RTTI.$toJavaScript(result);

		else if (type === RTTI_R_STRING)
			result = RTTI.$toString(result);

		if (ret) ret(result), ret = undefined; else ret = result;
	});

	return ret;
};

module.exports = Template;