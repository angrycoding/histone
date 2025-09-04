export default [
	`{{return []->has->toJSON = 'false'}}`,
	`{{return [1,2,3]->has->toJSON = 'false'}}`,
	`{{return [foo: 111]->has->toJSON = 'false'}}`,
	`{{return [1, 2, 3]->has(10)->toJSON = 'false'}}`,
	`{{return [1, 2, 3]->has(0)->toJSON = 'true'}}`,
	`{{return [1, 2, 3]->has("0")->toJSON = 'true'}}`,
	`{{return [1, 2, 3]->has("1")->toJSON = 'true'}}`,
	`{{return [1, 2, 3]->has(0x01)->toJSON = 'true'}}`,
	`{{return [1, 2, 3]->has(0b01)->toJSON = 'true'}}`,
	`{{return [1, 2, 3]->has(0b10)->toJSON = 'true'}}`,
	`{{return [1, 2, 3]->has(0b11)->toJSON = 'false'}}`,
	`{{return [1, 2, 3]->has("foo")->toJSON = 'false'}}`,
	`{{return [foo:1, x:2, y:3]->has("foo")->toJSON = 'true'}}`,
	`{{return [foo:1, x:2, y:3]->has("bar")->toJSON = 'false'}}`,
	`{{return [foo:1, x:2, foo:3]->has("foo")->toJSON = 'true'}}`
];
