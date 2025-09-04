export default [

	'{{macro foo}}{{/macro}}{{return foo->isMacro}}',
	'{{var foo ==> ""}}{{return foo->isMacro}}',
	'{{return 10->toMacro->isMacro}}',
	'{{return 10->toMacro()()->isNumber}}',
	'{{return 10->toMacro()() = 10}}',
	'{{macro foo}}A{{/macro}}{{var bar = foo->toMacro}}{{return bar() = "A"}}',
	'{{return (=> "A")->toMacro()() = "A"}}',

	(Histone, ret) => Histone(`
		{{macro foo}}{{/macro}}
		{{return foo->toBoolean}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var foo ==> false}}
		{{return foo->toBoolean}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo(a, b, c)}}
			{{return [a, b, c]}}
		{{/macro}}
		{{return foo->call(1, 2, 3)->join('.') = '1.2.3'}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo(a, b, c)}}
			{{return [a, b, c]}}
		{{/macro}}
		{{return foo->call([1, 2, 3])->join('.') = '1.2.3'}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo(a, b, c)}}
			{{return [a, b, c]}}
		{{/macro}}
		{{return foo->call(1, [2, 3])->join('.') = '1.2.3'}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo(a, b, c)}}
			{{return [a, b, c]}}
		{{/macro}}
		{{return foo->call([1, 2], 3)->join('.') = '1.2.3'}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var foo = (a, b, c) => [a, b, c]}}
		{{return foo->call(1, 2, 3)->join('.') = '1.2.3'}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var foo = (a, b, c) => [a, b, c]}}
		{{return foo->call([1, 2, 3])->join('.') = '1.2.3'}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var foo = (a, b, c) => [a, b, c]}}
		{{return foo->call(1, [2, 3])->join('.') = '1.2.3'}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var foo = (a, b, c) => [a, b, c]}}
		{{return foo->call([1, 2], 3)->join('.') = '1.2.3'}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo(a, b, c)}}
			{{return self.arguments->length = 3}}
		{{/macro}}
		{{return foo->bind()(1, 2, 3)}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo(a, b, c)}}
			{{return self.arguments->length = 4}}
		{{/macro}}
		{{return foo->bind('X')(1, 2, 3)}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo(a, b, c)}}
			{{return [a, b, c]}}
		{{/macro}}
		{{return foo->bind('X')(1, 2, 3)->join('.') = 'X.1.2'}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo(a, b, c)}}
			{{return [a, b, c]}}
		{{/macro}}
		{{return foo->bind('X', 'Y')(1, 2, 3)->join('.') = 'X.Y.1'}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo(a, b, c)}}
			{{return [a, b, c]}}
		{{/macro}}
		{{return foo->bind('X')->bind('Y')(1, 2, 3)->join('.') = 'Y.X.1'}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var foo = (a, b, c) => self.arguments->length = 3}}
		{{return foo->bind()(1, 2, 3)}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var foo = (a, b, c) => self.arguments->length = 4}}
		{{return foo->bind('X')(1, 2, 3)}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var foo = (a, b, c) => [a, b, c]}}
		{{return foo->bind('X')(1, 2, 3)->join('.') = 'X.1.2'}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var foo = (a, b, c) => [a, b, c]}}
		{{return foo->bind('X', 'Y')(1, 2, 3)->join('.') = 'X.Y.1'}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var foo = (a, b, c) => [a, b, c]}}
		{{return foo->bind('X')->bind('Y')(1, 2, 3)->join('.') = 'Y.X.1'}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var x = [1, 2, 3]}}
		{{macro foo(a = x)}}
			{{return a->join('.')}}
		{{/macro}}
		{{var a = x, x = [0, 0, 0]}}
		{{return a->join('.') = '1.2.3' && x->join('.') = '0.0.0' && foo() = '1.2.3'}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var x = [1, 2, 3]}}
		{{var foo = (a = x) => a->join('.')}}
		{{var a = x, x = [0, 0, 0]}}
		{{return a->join('.') = '1.2.3' && x->join('.') = '0.0.0' && foo() = '1.2.3'}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo}}
			{{return self->isArray}}
		{{/macro}}
		{{return foo()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo}}
			{{return self->has('callee')}}
		{{/macro}}
		{{return foo()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo}}
			{{return self->has('arguments')}}
		{{/macro}}
		{{return foo()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo}}
			{{return self->has('caller')}}
		{{/macro}}
		{{return foo()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo}}
			{{return self.callee->isMacro}}
		{{/macro}}
		{{return foo()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo(a)}}
			{{return a ? a : self.callee(10)}}
		{{/macro}}
		{{return foo() = 10}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo}}
			{{return self.arguments->isArray}}
		{{/macro}}
		{{return foo()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo}}
			{{return self.arguments->length = 0}}
		{{/macro}}
		{{return foo()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo(a, b, c)}}
			{{return self.arguments->length = 0}}
		{{/macro}}
		{{return foo()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo(a = 0, b = 1, c = 2)}}
			{{return self.arguments->length = 0}}
		{{/macro}}
		{{return foo()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo(a = 0, b = 1, c = 2)}}
			{{return self.arguments->length = 3}}
		{{/macro}}
		{{return foo(1, 2, 3)}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo(a = 0, b = 1, c = 2)}}
			{{return self.arguments->join('.') = '1.2.3'}}
		{{/macro}}
		{{return foo(1, 2, 3)}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo}}
			{{return self.caller->isString}}
		{{/macro}}
		{{return foo()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{macro foo}}
			{{return self.caller = getBaseURI}}
		{{/macro}}
		{{return foo()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{return (=> self->isArray)()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{return (=> self->has('callee'))()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{return (=> self->has('arguments'))()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{return (=> self->has('caller'))()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{return (=> self.callee->isMacro)()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{return (a => a ? a : self.callee(10))() = 10}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{return (=> self.arguments->isArray)()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{return (=> self.arguments->length = 0)()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{return ((a, b, c) => self.arguments->length = 0)()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{return ((a = 0, b = 1, c = 2) => self.arguments->length = 0)()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{return ((a = 0, b = 1, c = 2) => self.arguments->length = 3)(1, 2, 3)}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{return ((a = 0, b = 1, c = 2) => self.arguments->join('.') = '1.2.3')(1, 2, 3)}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{return (=> self.caller->isString)()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{return (=> self.caller = getBaseURI)()}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{return (=> self.caller)() = getBaseURI}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var arrow ==> 10 * 2}}
		{{return arrow() = 20}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var arrow = () => 10 * 2}}
		{{return arrow() = 20}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var arrow = value => value}}
		{{return arrow()->isUndefined}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var arrow = value => value}}
		{{return arrow(3) = 3}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var arrow = (a) => a}}
		{{return arrow('x') = 'x'}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var arrow = (a, b) => [a, b]->join('.')}}
		{{return arrow('x', 'y') = 'x.y'}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var arrow = (x = 10, y = 20) => x * y}}
		{{return arrow() = 200}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var arrow = (x = 10, y = 20) => x * y}}
		{{return arrow(3) = 60}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var arrow = (x = 10, y = 20) => x * y}}
		{{return arrow(3, undefined) = 60}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var arrow = (x = 10, y = 20) => x * y}}
		{{return arrow(3, 3) = 9}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var arrow = (x = 10, y = 20) => x * y}}
		{{return arrow(undefined, 3) = 30}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var f = '.', arrow = (x = 10, y = 20) => {{
			{{return [x, y]->join(f)}}
		}}}}
		{{return arrow('A', 'B') = 'A.B'}}
	`).render(ret),

	(Histone, ret) => {
		try { Histone(`{{macro foo}} {{break}} {{/macro}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{for in []}} {{macro foo}} {{break}} {{/macro}} {{/for}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{for in [] as label}} {{macro foo}} {{break label}} {{/macro}} {{/for}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{macro foo}} {{continue}} {{/macro}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{for in []}} {{macro foo}} {{continue}} {{/macro}} {{/for}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{for in [] as label}} {{macro foo}} {{continue label}} {{/macro}} {{/for}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{=> {{ {{break}} }}}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{for in []}} {{=> {{ {{break}} }}}} {{/for}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{for in [] as label}} {{=> {{ {{break label}} }}}} {{/for}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{=> {{ {{continue}} }}}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{for in []}} {{=> {{ {{continue}} }}}} {{/for}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{for in [] as label}} {{=> {{ {{continue label}} }}}} {{/for}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => Histone(`
		{{var x = [10]}}
		{{macro foo}}
			{{return x}}
		{{/macro}}
		{{var a = x, x = [20]}}
		{{return a[0] = 10 && x[0] = 20 && foo()[0] = 10}}
	`).render(ret),

	(Histone, ret) => Histone(`
		{{var x = [10]}}
		{{var foo ==> x}}
		{{var a = x, x = [20]}}
		{{return a[0] = 10 && x[0] = 20 && foo()[0] = 10}}
	`).render(ret),


	(Histone, ret) => {
		try { Histone(`{{macro`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{macro a`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{macro a}}bla-bla`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{macro a(f,}}{{/macro}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{macro a(f}}{{/macro}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{macro a(dup, dup)}}{{/macro}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{var a()}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{var a(f,) => 10}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{var a(f => 10}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => {
		try { Histone(`{{var a(dup, dup) => 10}}`).render() }
		catch (e) { ret(true); }
	},

	'{{return (=> 10)() = 10}}',
	'{{return (x => x + 10)(3) = 13}}',
	'{{return (() => 10)() = 10}}',
	'{{return ((x, y) => x * y)(2, 3) = 6}}',
	'{{return ((x) => x * 20)(3) = 60}}',
	'{{return ((x, y = 200) => x * y)(3) = 600}}',
	'{{var x => 10 * 2}}{{return x() = 20}}',
	'{{var x() => 10 * 2}}{{return x() = 20}}',
	'{{var x(a) => a * 2}}{{return x(6) = 12}}',
	'{{var x(a, b) => a * b}}{{return x(6, 3) = 18}}',
	'{{var x(a, b = 30) => a * b}}{{return x(6, 3) = 18}}',
	'{{var x(a, b = 30) => a * b}}{{return x(6) = 180}}'

];