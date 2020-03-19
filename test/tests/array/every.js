module.exports = [
	'{{return []->every->toString = "false"}}',
	'{{return []->every()->toString = "false"}}',
	'{{return [1, 2, 3, 4, 5]->every->toString = "false"}}',
	'{{return [1, 2, 3, 4, 5]->every()->toString = "false"}}',
	'{{return [1, 30, 39, 29, 10, 13]->every(element => element < 40)->toString = "true"}}',
	'{{return [12, 5, 8, 130, 44]->every(element => element >= 10)->toString = "false"}}',
	'{{return [12, 54, 18, 130, 44]->every(element => element >= 10)->toString = "true"}}',
	`{{return [0, 0, 0, 1, 2, 3, 4]->every((element, index, array) => array[index] = element)->toString = "true"}}`,
	`{{return [0, 0, 0, 1, 2, 3, 4, 11]->every(=> self.arguments->length = 3)->toString = 'true'}}`,
	`{{return [0, 0, 0, 1, 2, 3, 4, 11]->every(=> self.arguments->length = 4, 1)->toString = 'true'}}`,
	`{{return [0, 0, 0, 1, 2, 3, 4, 11]->every(=> self.arguments->length = 5, 1, 2)->toString = 'true'}}`,
	`{{return [0, 0, 0, 1, 2, 3, 4, 11]->every((a, b, element, index, array) => a = 1 && b = 2 && array[index] = element, 1, 2)->toString = 'true'}}`
];
