module.exports = [
	'{{return []->toBoolean->toJSON = "true"}}',
	'{{return [1,2,3]->toBoolean->toJSON = "true"}}',
	'{{return ["foo": "bar"]->toBoolean->toJSON = "true"}}'
];
