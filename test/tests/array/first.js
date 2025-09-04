export default [
	`{{return []->first->isUndefined->toString = "true"}}`,
	`{{return [1]->first->toJSON = '1'}}`,
	`{{return [0, 1]->first->toJSON = '0'}}`,
	`{{return [foo:1]->first->toJSON = '1'}}`,
	`{{return [foo:1, 0: 'xxx']->first->toJSON = '1'}}`,
	`{{return [0:1, 0: 'xxx']->first->toJSON = '"xxx"'}}`,
];
