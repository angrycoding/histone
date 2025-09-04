export default [
	'{{return []->reverse->toJSON = "[]"}}',
	'{{return [1]->reverse->toJSON = "[1]"}}',
	'{{return [1, 2, 3]->reverse->toJSON = "[3,2,1]"}}',
	`{{return [foo: 1, bar: 2]->reverse->toJSON = '{"bar":2,"foo":1}'}}`,
	`{{return [foo: 1, bar: 2, baz: 3]->reverse->toJSON = '{"baz":3,"bar":2,"foo":1}'}}`,
	`{{return [3:333,2:222,1:111]->reverse->toJSON = '{"1":111,"2":222,"3":333}'}}`,
	`{{return [0:333,1:222,2:111]->reverse->toJSON = '[111,222,333]'}}`,
	`{{return [2:333,1:222,0:111]->reverse->toJSON = '[111,222,333]'}}`
];
