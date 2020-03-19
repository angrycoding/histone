module.exports = [
	`{{return []->values->toJSON = "[]"}}`,
	`{{return [1, 2, 3]->values->toJSON = '[1,2,3]'}}`,
	`{{return ["foo": "bar"]->values->toJSON = '["bar"]'}}`,
	`{{return ["foo": "bar", "x": 1111]->values->toJSON = '["bar",1111]'}}`,
	`{{return ["foo": "bar", 0: 0, 1: 1, 2: 2]->values->toJSON = '["bar",0,1,2]'}}`,
	`{{return ["foo": "bar", 0: 0, 1: 1, 2: 2, "foo": "ba"]->values->toJSON = '[0,1,2,"ba"]'}}`
];
