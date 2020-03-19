module.exports = [
	'{{return []->length = 0}}',
	'{{return [1,2,3]->length = 3}}',
	'{{return ["foo": "bar"]->length = 1}}',
	'{{return ["foo": "bar", "x": "y"]->length = 2}}',
	'{{return ["foo": "bar", "foo": "baz"]->length = 1}}',
	'{{return ["foo": "bar", "x": "y", "foo": "2"]->length = 2}}'
];
