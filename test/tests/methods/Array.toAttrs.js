module.exports = [
	`{{return []->toAttrs = ""}}`,
	`{{return [foo:"bar",bar:"baz"]->toAttrs = 'foo="bar" bar="baz"'}}`,
	`{{return [1,2,3,4,5]->toAttrs = '0="1" 1="2" 2="3" 3="4" 4="5"'}}`,
	`{{return [true, false, 0x32, 0b11, -10]->toAttrs = '0="true" 1="false" 2="50" 3="3" 4="-10"'}}`,
];
