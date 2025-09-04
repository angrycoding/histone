import HistoneArray from './Array.js';
import Constants from '../Constants.js';

function HistoneGlobal() {
	HistoneArray.apply(this, arguments);
	this.set(Constants.VERSION, 'version');
	try { this.set(this === window && 'browser', 'server'); }
	catch (exception) { this.set('nodejs', 'server'); }
	this.set(Constants.HAS_PARSER, 'parser');
}

HistoneGlobal.prototype = Object.create(HistoneArray.prototype);
HistoneGlobal.prototype.constructor = HistoneGlobal;



export default HistoneGlobal;