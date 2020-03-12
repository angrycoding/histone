module.exports = [
	`{{return []->toCSS = ""}}`,
	`{{return [foo:"bar",bar:"baz"]->toCSS = 'foo:bar;bar:baz;'}}`,
	`{{return [
		'background-color': 'red',
		'border': '1px solid red',
		'position': 'absolute'
	]->toCSS = 'background-color:red;border:1px solid red;position:absolute;'}}`,
];
