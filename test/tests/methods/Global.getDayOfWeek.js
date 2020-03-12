module.exports = [
	'{{return getDayOfWeek->isUndefined}}',
	'{{return getDayOfWeek()->isUndefined}}',
	'{{return getDayOfWeek(2016)->isUndefined}}',
	'{{return getDayOfWeek(2016, 1)->isUndefined}}',
	'{{return getDayOfWeek(2016, 0, 1)->isUndefined}}',
	'{{return getDayOfWeek(2016, 13, 1)->isUndefined}}',
	'{{return getDayOfWeek(2016, 1, 0)->isUndefined}}',
	'{{return getDayOfWeek(2016, 1, 32)->isUndefined}}',
	'{{return getDayOfWeek(89, 1, 1) = 6}}',
	'{{return getDayOfWeek(1989, 1, 1) = 7}}',
	'{{return getDayOfWeek(2017, 2, 1) = 3}}',
	'{{return getDayOfWeek(2016, 2, 29) = 1}}',
	'{{return getDayOfWeek(2017, 2, 29)->isUndefined}}'
];
