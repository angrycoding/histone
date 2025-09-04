export default [
	`{{return []->keys->toJSON = "[]"}}`,
	`{{return [1, 2, 3]->keys->toJSON = '["0","1","2"]'}}`,
	`{{return ["foo": "bar"]->keys->toJSON = '["foo"]'}}`,
	`{{return ["foo": "bar", "x": 1111]->keys->toJSON = '["foo","x"]'}}`,
	`{{return ["foo": "bar", 0: 0, 1: 1, 2: 2]->keys->toJSON = '["foo","0","1","2"]'}}`,
	`{{return ["foo": "bar", 0: 0, 1: 1, 2: 2, "foo": "ba"]->keys->toJSON = '["0","1","2","foo"]'}}`
];
