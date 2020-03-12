module.exports = [
	`{{return []->flip->toJSON = "[]"}}`,
	`{{return [1]->flip->toJSON = '{"1":"0"}'}}`,
	`{{return [foo:'bar']->flip->toJSON = '{"bar":"foo"}'}}`,
	`{{return [1, 2, 3]->flip->toJSON = '{"1":"0","2":"1","3":"2"}'}}`,
	`{{return [0, 1, 2]->flip->toJSON = '["0","1","2"]'}}`
];
