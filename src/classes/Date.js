import Utils from '../Utils.js';
import HistoneArray from './Array.js';

function HistoneDate(offset) {

	HistoneArray.apply(this, arguments);

	var date = Array.prototype.slice.call(arguments);

	date = Utils.$dateOffset((
		date[0] instanceof Date ?
		date.shift() : new Date
	), date.shift());

	this.set(date.getDate(), 'day');
	this.set(date.getMonth() + 1, 'month');
	this.set(date.getFullYear(), 'year');
	this.set(date.getHours(), 'hour');
	this.set(date.getMinutes(), 'minute');
	this.set(date.getSeconds(), 'second');
}

HistoneDate.prototype = Object.create(HistoneArray.prototype);
HistoneDate.prototype.constructor = HistoneDate;

/** @expose */
HistoneDate.prototype.toJavaScript = function() {

	var result = new Date();
	result.setFullYear(this.get('year'));
	result.setMonth(this.get('month') - 1);
	result.setDate(this.get('day'));
	result.setHours(this.get('hour'));
	result.setMinutes(this.get('minute'));
	result.setSeconds(this.get('second'));
	result.setMilliseconds(0);
	return result;


};

export default HistoneDate;