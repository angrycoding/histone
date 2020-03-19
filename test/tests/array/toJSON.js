module.exports = [
	`{{return []->toJSON = "[]"}}`,
	`{{return [1, 2, 3]->toJSON = "[1,2,3]"}}`,
	`{{return ["1", "2", "3"]->toJSON = '["1","2","3"]'}}`,
	`{{return [0:"1", 1:"2", 2:"3"]->toJSON = '["1","2","3"]'}}`,
	`{{return [1:"1", 0:"2", 1:"3"]->toJSON = '["2","3"]'}}`,
	`{{return ["x":"1", 0: 222, "z":true]->toJSON = '{"x":"1","0":222,"z":true}'}}`,
	`{{return ["x":["1",2,3], 0: [foo:"bar"], "z":[[true], [false]]]->toJSON = '{"x":["1",2,3],"0":{"foo":"bar"},"z":[[true],[false]]}'}}`
];
