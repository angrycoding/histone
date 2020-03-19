module.exports = [
	`{{return []->find->isUndefined->toString = "true"}}`,
	`{{return [1, 2, 3, 4]->find->isUndefined->toString = "true"}}`,
	`{{return [foo:1, bar:2, x:3, y:4]->find->isUndefined->toString = "true"}}`,
	`{{return [5, 12, 8, 130, 44]->find(element => element > 10)->toJSON = '12'}}`,
	`{{return [5, 12, 8, 130, 44]->find(element => element > 10, true)->toJSON = '"1"'}}`,
	`{{return [foo:5, bar:12, x:8, y:130, z:44]->find(element => element = 8)->toJSON = '8'}}`,
	`{{return [foo:5, bar:12, x:8, y:130, z:44]->find(element => element = 8, true)->toJSON = '"x"'}}`,
	`
		{{var inventory = [
			[name: 'apples', quantity: 2],
			[name: 'bananas', quantity: 0],
			[name: 'cherries', quantity: 5]
		]}}

		{{macro isCherries(fruit)}}
			{{return fruit.name = 'cherries'}}
		{{/macro}}

		{{return
			inventory->find(isCherries)->toJSON = '{"name":"cherries","quantity":5}' &&
			inventory->find(isCherries, true)->toJSON = '"2"'
		}}
	`
];
