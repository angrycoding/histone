module.exports = [
	`{{return []->toArray->toJSON = "[]"}}`,
	`{{return [1, 2, 3]->toArray->toJSON = "[1,2,3]"}}`,
	`{{return [foo:1, x:2, y:3]->toArray->toJSON = '{"foo":1,"x":2,"y":3}'}}`,
	`{{return undefined->toArray->toJSON = "[null]"}}`,
	`{{return null->toArray->toJSON = "[null]"}}`,
	`{{return "string"->toArray->toJSON = '["string"]'}}`,
	`{{return ""->toArray->toJSON = '[""]'}}`,
	`{{return 10->toArray->toJSON = "[10]"}}`,
	`{{return 0->toArray->toJSON = "[0]"}}`,
	`{{return /regexp/->toArray->toJSON = '["/regexp/"]'}}`,
	`{{return true->toArray->toJSON = "[true]"}}`,
	`{{return false->toArray->toJSON = "[false]"}}`
];
