export default [
	`{{return []->toString = ""}}`,
	`{{return [1, 2, 3]->toString = "1 2 3"}}`,
	`{{return [foo:1, bar:2, baz:3]->toString = "1 2 3"}}`,
	`{{return [foo:"a", bar:"bbbb", baz:"cccc"]->toString = "a bbbb cccc"}}`,
	(Histone, ret) => {
		Histone('{{[foo:1, bar:2, baz:3]}}').render(function(result) {
			ret(result === '1 2 3');
		});
	},
	(Histone, ret) => {
		Histone('{{[foo:"a", bar:"bbbb", baz:"cccc"]}}').render(function(result) {
			ret(result === 'a bbbb cccc');
		});
	},
];
