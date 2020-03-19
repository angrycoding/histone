module.exports = [
	`{{return []->group->toJSON = "[]"}}`,
	`{{return [1, 2, 3, 4]->group->toJSON = "[1,2,3,4]"}}`,
	`{{return [a:1, b:2, c:3, d:4]->group->toJSON = '{"a":1,"b":2,"c":3,"d":4}'}}`,
	`{{return [1, 2, 3, 4, 5, 6, 7, 8, 9]->group(num => num > 5 ? 'biggerThanFive' : 'lessOrEqualsToFive')->toJSON = '{"lessOrEqualsToFive":[1,2,3,4,5],"biggerThanFive":[6,7,8,9]}'}}`,
	`{{return []->group(num => num > 5 ? 'biggerThanFive' : 'lessOrEqualsToFive')->toJSON = '[]'}}`,
	`{{return [1, 2, 3, 4, 5]->group(num => num > 5 ? 'biggerThanFive' : 'lessOrEqualsToFive')->toJSON = '{"lessOrEqualsToFive":[1,2,3,4,5]}'}}`,
	`{{return [6, 7, 8, 9]->group(num => num > 5 ? 'biggerThanFive' : 'lessOrEqualsToFive')->toJSON = '{"biggerThanFive":[6,7,8,9]}'}}`,
	`{{return [6, 7]->group(num => num > 5 ? 'biggerThanFive' : 'lessOrEqualsToFive')->toJSON = '{"biggerThanFive":[6,7]}'}}`,
	`{{return [7]->group(num => num > 5 ? 'biggerThanFive' : 'lessOrEqualsToFive')->toJSON = '{"biggerThanFive":[7]}'}}`,
	`{{return []->group(num => num > 5 ? 'biggerThanFive' : 'lessOrEqualsToFive')->toJSON = '[]'}}`
];
