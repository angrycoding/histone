export default [

	(Histone, ret) => Histone(`{{return range(1, 4)->join('.') = '1.2.3.4'}}`).render(ret),

	(Histone, ret) => Histone(`{{return [foo: 'bar']['foo'] = 'bar'}}`).render(ret),
	(Histone, ret) => {
		try { Histone(`{{[1, 2, 3][0}}`).render() }
		catch (e) { ret(true); }
	},

	(Histone, ret) => Histone(`{{return [foo: 'bar'].foo = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].undefined->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [undefined: 'bar'].undefined = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].null->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [null: 'bar'].null = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].true->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [true: 'bar'].true = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].false->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [false: 'bar'].false = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].elseif->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [elseif: 'bar'].elseif = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].if->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [if: 'bar'].if = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].in->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [in: 'bar'].in = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].as->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [as: 'bar'].as = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].for->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [for: 'bar'].for = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].var->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [var: 'bar'].var = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].else->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [else: 'bar'].else = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].macro->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [macro: 'bar'].macro = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].return->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [return: 'bar'].return = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].break->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [break: 'bar'].break = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].continue->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [continue: 'bar'].continue = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].while->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [while: 'bar'].while = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].this->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [this: 'bar'].this = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].self->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [self: 'bar'].self = 'bar'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar'].global->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [global: 'bar'].global = 'bar'}}`).render(ret),
	(Histone, ret) => {
		try { Histone(`{{[1, 2, 3].}}`).render() }
		catch (e) { ret(true); }
	},
	(Histone, ret) => {
		try { Histone(`{{[1, 2, 3].0b01}}`).render() }
		catch (e) { ret(true); }
	},
	(Histone, ret) => {
		try { Histone(`{{[1, 2, 3].0x32}}`).render() }
		catch (e) { ret(true); }
	},
	(Histone, ret) => {
		try { Histone(`{{[1, 2, 3].8}}`).render() }
		catch (e) { ret(true); }
	},
	(Histone, ret) => {
		try { Histone(`{{[1, 2, 3].8e3}}`).render() }
		catch (e) { ret(true); }
	},
	(Histone, ret) => {
		try { Histone(`{{[1, 2, 3].8.32}}`).render() }
		catch (e) { ret(true); }
	},



	(Histone, ret) => Histone(`{{return [1, 2]->join('.') = '1.2'}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->undefined->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->null->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->true->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->false->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->elseif->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->if->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->in->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->as->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->for->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->var->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->else->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->macro->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->return->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->break->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->continue->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->while->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->this->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->self->isUndefined}}`).render(ret),
	(Histone, ret) => Histone(`{{return [foo: 'bar']->global->isUndefined}}`).render(ret),
	(Histone, ret) => {
		try { Histone(`{{[1, 2, 3]->}}`).render() }
		catch (e) { ret(true); }
	},
	(Histone, ret) => {
		try { Histone(`{{[1, 2, 3]->0b01}}`).render() }
		catch (e) { ret(true); }
	},
	(Histone, ret) => {
		try { Histone(`{{[1, 2, 3]->0x32}}`).render() }
		catch (e) { ret(true); }
	},
	(Histone, ret) => {
		try { Histone(`{{[1, 2, 3]->8}}`).render() }
		catch (e) { ret(true); }
	},
	(Histone, ret) => {
		try { Histone(`{{[1, 2, 3]->8e3}}`).render() }
		catch (e) { ret(true); }
	},
	(Histone, ret) => {
		try { Histone(`{{[1, 2, 3]->8.32}}`).render() }
		catch (e) { ret(true); }
	}

];