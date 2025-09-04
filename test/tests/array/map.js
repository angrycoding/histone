export default [
	'{{return []->map->toJSON = "[]"}}',
	'{{return []->map()->toJSON = "[]"}}',
	`{{return [1, 2, 3, 4, 5]->map[0]->isUndefined->toString = "true"}}`,
	`{{return [1, 2, 3, 4, 5]->map[1]->isUndefined->toString = "true"}}`,
	`{{return [1, 2, 3, 4, 5]->map[2]->isUndefined->toString = "true"}}`,
	`{{return [1, 2, 3, 4, 5]->map[3]->isUndefined->toString = "true"}}`,
	`{{return [1, 2, 3, 4, 5]->map[4]->isUndefined->toString = "true"}}`,
	`{{return [1, 2, 3, 4, 5]->map()[0]->isUndefined->toString = "true"}}`,
	`{{return [1, 2, 3, 4, 5]->map()[1]->isUndefined->toString = "true"}}`,
	`{{return [1, 2, 3, 4, 5]->map()[2]->isUndefined->toString = "true"}}`,
	`{{return [1, 2, 3, 4, 5]->map()[3]->isUndefined->toString = "true"}}`,
	`{{return [1, 2, 3, 4, 5]->map()[4]->isUndefined->toString = "true"}}`,
	`{{return range(100)->map->length = 100}}`,
	`{{return [1, 4, 9, 16]->map(x => x * 2)->toJSON = '[2,8,18,32]'}}`,
	`{{return [1, 4, 9]->map(x => x / 2)->toJSON = '[0.5,2,4.5]'}}`,
	`{{[[key: 1, value: 10], [key: 2, value: 20], [key: 3, value: 30]]->map(obj => {{
		{{return []->set(obj.key, obj.value)}}
	}})->toJSON = '[{"1":10},{"2":20},{"3":30}]'}}`,
	`{{return 'Hello World'->split->map(char => char->charCodeAt(0))->toJSON = '[72,101,108,108,111,32,87,111,114,108,100]'}}`,
	`{{range(10)->map->toJSON = '[null,null,null,null,null,null,null,null,null,null]'}}`
];
