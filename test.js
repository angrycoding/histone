var FS = require('fs');	
var Histone = require('./src/Histone');


FS.readFile('template.tpl', 'utf-8', function(error, template) {
	Histone(template).render(Histone.R_STRING, function(result) {
		console.info(result, typeof result)
	}, [1, 2, 3, 4], {
		foo: 'bar',
		x: 'y',
		'foox': 'mooz'
	});
});


// var tree  = H(`

// 	{{/^[a-z]+$/igm->test('foobar')}}

// `);


// console.info(JSON.stringify(tree))

// var tpl = `
// 	{{/^[a-z]+$/igm->test('foobar')}}
// `;


// var ast = Histone(tpl).getAST();


// ast = JSON.stringify(ast);

// ast = JSON.parse(ast, function(k, v) {
// 	if (v instanceof Array && v[0] === 2) {
// 		return /^[a-z]+$/igm;
// 	}
// 	return v;
// });


// console.info(ast)

// Histone(ast).render(function(result) {
// 	console.info(result)
// })