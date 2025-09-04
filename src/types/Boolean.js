import RTTI from '../RTTI.js';
import Constants from '../Constants.js';

const
	BasePrototype = RTTI.$Base.prototype,
	BooleanPrototype = RTTI.$Boolean.prototype;

RTTI.$register(BasePrototype, 'isBoolean', false);
RTTI.$register(BasePrototype, 'toBoolean', false);
RTTI.$register(BooleanPrototype, 'isBoolean', true);
RTTI.$register(BooleanPrototype, 'toBoolean', Constants.RTTI_R_SELF);
RTTI.$register(BooleanPrototype, 'toNumber', (self) => self ? 1 : 0);
RTTI.$register(BooleanPrototype, 'toString', (self) => self ? 'true' : 'false');
RTTI.$register(BooleanPrototype, 'toJSON', (self) => self ? 'true' : 'false');