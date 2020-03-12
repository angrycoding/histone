module.exports = [
	`{{return []->join = ""}}`,
	`{{return [1, 2, 3]->join = "123"}}`,
	`{{return [foo:'bar',baz:'boo']->join = "barboo"}}`,
	`{{return [foo:0x32,baz:0b11]->join = "503"}}`,
	`{{return [1, 2, 3]->join() = "123"}}`,
	`{{return [1, 2, 3]->join(0x32) = "1502503"}}`,
	`{{return [1, 2, 3]->join('.') = "1.2.3"}}`,
	`{{return ['Fire', 'Air', 'Water']->join = "FireAirWater"}}`,
	`{{return ['Fire', 'Air', 'Water']->join('-') = "Fire-Air-Water"}}`
];
