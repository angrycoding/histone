module.exports = [
	'{{return []->reverse->toJSON = "[]"}}',
	'{{return [1]->reverse->toJSON = "[1]"}}',
	'{{return [1, 2, 3]->reverse->toJSON = "[3,2,1]"}}',
	`{{return [foo: 1, bar: 2]->reverse->isUndefined->toString = 'true'}}`,
	`{{return [foo: 1, bar: 2, baz: 3]->reverse->isUndefined->toString = 'true'}}`,
	`{{return [3:333,2:222,1:111]->reverse->isUndefined->toString = 'true'}}`,
	`{{return [0:333,1:222,2:111]->reverse->isUndefined->toString = 'true'}}`,
];
