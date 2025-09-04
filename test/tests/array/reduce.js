export default [
	`{{return []->reduce->isUndefined->toString = "true"}}`,
	`{{return [1, 2, 3, 4]->reduce((accumulator, currentValue) => accumulator + currentValue)->toJSON = 10}}`,
	`{{return [1, 2, 3, 4]->reduce((accumulator, currentValue) => accumulator + currentValue, 5)->toJSON = 15}}`,
	`
	{{var maxCallback = ( acc, cur ) => getMax( acc.x, cur.x )}}
	{{var maxCallback2 = ( max, cur ) => getMax( max, cur )}}
	{{return [[x: 2], [x: 22], [x: 42]]->reduce( maxCallback )->toJSON = '42'}}
	`,
	`
	{{var maxCallback = ( acc, cur ) => getMax( acc.x, cur.x )}}
	{{var maxCallback2 = ( max, cur ) => getMax( max, cur )}}
	{{return [[x: 2], [x: 22]]->reduce( maxCallback )->toJSON = '22'}}
	`,
	`
	{{var maxCallback = ( acc, cur ) => getMax( acc.x, cur.x )}}
	{{var maxCallback2 = ( max, cur ) => getMax( max, cur )}}
	{{return [[x: 2]]->reduce( maxCallback )->toJSON = '{"x":2}'}}
	`,
	`
	{{var maxCallback = ( acc, cur ) => getMax( acc.x, cur.x )}}
	{{var maxCallback2 = ( max, cur ) => getMax( max, cur )}}
	{{return []->reduce( maxCallback )->isUndefined->toJSON = 'true'}}
	`,
	`
	{{var maxCallback = ( acc, cur ) => getMax( acc.x, cur.x )}}
	{{var maxCallback2 = ( max, cur ) => getMax( max, cur )}}
	{{return [[x: 2], [x: 22]]->reduce( maxCallback2, -100000 )->toJSON = '22'}}
	`,
	`{{return [0, 1, 2, 3]->reduce((accumulator, currentValue) => accumulator + currentValue, 0)->toJSON = '6'}}`,
	`{{return [[x: 1], [x: 2], [x: 3]]->reduce((accumulator, currentValue) => accumulator + currentValue.x, 0)->toJSON = '6'}}`,
	`{{return [[0, 1], [2, 3], [4, 5]]->reduce( (accumulator, currentValue) => accumulator + currentValue, [])->toJSON = '[0,1,2,3,4,5]'}}`,
	`
	{{return ["Alice", "Bob", "Tiff", "Bruce", "Alice"]->reduce((allNames, name) => {{
		{{if allNames->has(name)}}
			{{return allNames->set(allNames[name] + 1, name)}}
		{{else}}
			{{return allNames->set(1, name)}}
		{{/if}}
	}}, [])->toJSON = '{"Alice":2,"Bob":1,"Tiff":1,"Bruce":1}'}}
	`,
	`
	{{var people = [
		[ name: 'Alice', age: 21 ],
		[ name: 'Max', age: 20 ],
		[ name: 'Jane', age: 20 ]
	]}}

	{{macro groupBy(objectArray, property)}}
		{{return objectArray->reduce((acc, obj) => {{
			{{var key = obj[property]}}

			{{if !acc[key]}}
				{{return acc->set([obj], key)}}
			{{else}}
				{{return acc->set(acc[key]->set(obj), key)}}
			{{/if}}

		}}, [])}}
	{{/macro}}

	{{var result = groupBy(people, 'age')}}


	{{return 
		result[21]->length = 1 &&
		result[21][0].name = 'Alice' &&
		result[21][0].age = 21 &&
		result[20]->length = 2 &&
		result[20][0].age = 20 &&
		result[20][1].age = 20
	}}
	`,
	`
	{{return ['a', 'b', 'a', 'b', 'c', 'e', 'e', 'c', 'd', 'd', 'd', 'd']->reduce((accumulator, currentValue) => (
		accumulator->some(item => item = currentValue) ?
		accumulator :
		accumulator->set(currentValue)
	), [])->toJSON = '["a","b","c","e","d"]'}}
	`,
	`
	{{return [-5, 6, 2, 0,]->reduce((accumulator, currentValue) => {{
		{{if currentValue > 0}}
			{{return accumulator->set(currentValue * 2)}}
		{{else}}
			{{return accumulator}}
		{{/if}}
	}}, [])->toJSON = '[12,4]'}}
	`
];
