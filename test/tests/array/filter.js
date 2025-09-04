export default [
	'{{return []->filter->toJSON = "[]"}}',
	'{{return []->filter()->toJSON = "[]"}}',
	'{{return [1, 2, 3, 4, 5]->filter->toJSON = "[]"}}',
	'{{return [1, 2, 3, 4, 5]->filter()->toJSON = "[]"}}',
	`{{return ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present']->filter(word => word->length > 6)->toJSON = '["exuberant","destruction","present"]'}}`,
	`{{return [12, 5, 8, 130, 44]->filter(i => i >= 10)->toJSON = '[12,130,44]'}}`,
	`
		{{var array = [4, 6, 8, 9, 12, 53, -17, 2, 5, 7, 31, 97, -1, 17]}}
		
		{{macro isPrime(num)}}
			{{if num <= 1}}
				{{return false}}
			{{elseif num = 2}}
				{{return true}}
			{{else}}
				{{for i in range(2, num - 1)}}
					{{if num % i = 0}}
						{{return false}}
					{{/if}}
				{{/for}}
			{{/if}}
			{{return true}}
		{{/macro}}

		{{return array->filter(isPrime)->toJSON = '[53,2,5,7,31,97,17]'}}
	`,
	`
		{{var arr = [
			[id: 15],
			[id: -1],
			[id: 0],
			[id: 3],
			[id: 12.2],
			[],
			[id: null],
			[id: NaN],
			[id: 'undefined']
		]}}

		{{macro filterByID(item)}}
			{{if item.id->isNumber && item.id != 0}}
				{{return true}}
			{{else}}
				{{return false}}
			{{/if}}
		{{/macro}}

		{{return arr->filter(filterByID)->toJSON = '[{"id":15},{"id":-1},{"id":3},{"id":12.2}]'}}
	`,
	`
		{{var
			fruits = ['apple', 'banana', 'grapes', 'mango', 'orange'],
			filterItems = (arr, query) => {{
				{{return arr->filter(el => el->toLowerCase->indexOf(query->toLowerCase) != -1)}}
			}}
		}}
		{{return filterItems(fruits, 'ap')->toJSON = '["apple","grapes"]' && filterItems(fruits, 'an')->toJSON = '["banana","mango","orange"]'}}
	`,
	`{{return [1, 2, 3, 4]->filter((el, index, arr) => arr[index] = el)->toJSON = '[1,2,3,4]'}}`,
	`{{return [1, 2, 3, 4]->filter((el, index, arr) => self.arguments->length = 3)->toJSON = '[1,2,3,4]'}}`,
	`{{return [1, 2, 3, 4, 90, 0, -10, 20, 10, 2, 30, 9, 10, 8, 7]->filter((min, max, el, index, arr) => arr[index] >= min && el <= max, 2, 10)->toJSON = '[2,3,4,10,2,9,10,8,7]'}}`
];
