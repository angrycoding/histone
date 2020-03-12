module.exports = [
	`{{return []->set->toJSON = "[]"}}`,
	`{{return []->set('foo', 'bar')->toJSON = '{"bar":"foo"}'}}`,
	`{{return []->set('foo', 'bar')->set('y', 'x')->toJSON = '{"bar":"foo","x":"y"}'}}`,
	`{{return []->set('foo')->toJSON = '["foo"]'}}`,
	`{{return []->set('foo')->set('bar')->toJSON = '["foo","bar"]'}}`,
	`{{return []->set('foo', 0)->set('bar', 1)->toJSON = '["foo","bar"]'}}`,
	`{{return []->set('foo', 1)->set('bar', 0)->toJSON = '{"1":"foo","0":"bar"}'}}`,
];
