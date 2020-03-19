module.exports = [
	`{{return []->last->isUndefined->toString = "true"}}`,
	`{{return [1]->last->toJSON = '1'}}`,
	`{{return [0, 1]->last->toJSON = '1'}}`,
	`{{return [foo:1]->last->toJSON = '1'}}`,
	`{{return [foo:1, 0: 'xxx']->last->toJSON = '"xxx"'}}`,
	`{{return [0:1, 0: 'xxx']->last->toJSON = '"xxx"'}}`,
];
