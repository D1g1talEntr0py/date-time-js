import { describe, expect, it, test } from '@jest/globals';
import BaseDateTime from '../src/base-date-time.js';
import { DateField, DateTimeUnit } from '../src/constants.js';
import { _get, _set, _splice, _startOf } from '../src/utils.js';
import { _checkDateProperties, _createCurrentUtcDate, _createDatesFromArray } from './test.utilities.js';

describe('_set:Date mutated from internal function should match date mutated from native method', () => {
	const year = 2048;
	const month = 11;
	const day = 25;
	const hours = 23;
	const minutes = 59;
	const seconds = 59;
	const milliseconds = 999;
	const date1 = new Date();
	const date2 = new Date();

	test('year', () => expect(_set(date1, DateField.year, year)).toBe(date2.setFullYear(year)));
	test('month', () => expect(_set(date1, DateField.month, month)).toBe(date2.setMonth(month)));
	test('day', () => expect(_set(date1, DateField.day, day)).toBe(date2.setDate(day)));
	test('hours', () => expect(_set(date1, DateField.hour, hours)).toBe(date2.setHours(hours)));
	test('minutes', () => expect(_set(date1, DateField.minute, minutes)).toBe(date2.setMinutes(minutes)));
	test('seconds', () => expect(_set(date1, DateField.second, seconds)).toBe(date2.setSeconds(seconds)));
	test('milliseconds', () => expect(_set(date1, DateField.millisecond, milliseconds)).toBe(date2.setMilliseconds(milliseconds)));
});

describe('"_set" UTC method values equal corresponding value from native date method', () => {
	const year = 2022;
	const month = 7;
	const day = 22;
	const hours = 13;
	const minutes = 48;
	const seconds = 59;
	const milliseconds = 300;
	const date1 = _createCurrentUtcDate();
	const date2 = new Date(date1.valueOf());

	test('year', () => expect(_set(date1, DateField.year, year, true)).toBe(date2.setUTCFullYear(year)));
	test('month', () => expect(_set(date1, DateField.month, month, true)).toBe(date2.setUTCMonth(month)));
	test('day', () => expect(_set(date1, DateField.day, day, true)).toBe(date2.setUTCDate(day)));
	test('hours', () => expect(_set(date1, DateField.hour, hours, true)).toBe(date2.setUTCHours(hours)));
	test('minutes', () => expect(_set(date1, DateField.minute, minutes, true)).toBe(date2.setUTCMinutes(minutes)));
	test('seconds', () => expect(_set(date1, DateField.second, seconds, true)).toBe(date2.setUTCSeconds(seconds)));
	test('milliseconds', () => expect(_set(date1, DateField.millisecond, milliseconds, true)).toBe(date2.setUTCMilliseconds(milliseconds)));
});

describe('"_get" method values equal the constant values', () => {
	const year = 2022;
	const month = 7;
	const day = 22;
	const hours = 13;
	const minutes = 48;
	const seconds = 59;
	const milliseconds = 300;
	const date = new Date(year, month, day, hours, minutes, seconds, milliseconds);

	test('year', () => expect(_get(date, DateField.year)).toBe(year));
	test('month', () => expect(_get(date, DateField.month)).toBe(month));
	test('day', () => expect(_get(date, DateField.day)).toBe(day));
	test('hours', () => expect(_get(date, DateField.hour)).toBe(hours));
	test('minutes', () => expect(_get(date, DateField.minute)).toBe(minutes));
	test('seconds', () => expect(_get(date, DateField.second)).toBe(seconds));
	test('milliseconds', () => expect(_get(date, DateField.millisecond)).toBe(milliseconds));
});

describe('"_get" method values equal corresponding value from native date method', () => {
	const year = 2022;
	const month = 7;
	const day = 22;
	const hours = 13;
	const minutes = 48;
	const seconds = 59;
	const milliseconds = 300;
	const date = new Date(year, month, day, hours, minutes, seconds, milliseconds);

	test('year', () => expect(_get(date, DateField.year)).toBe(date.getFullYear()));
	test('month', () => expect(_get(date, DateField.month)).toBe(date.getMonth()));
	test('day', () => expect(_get(date, DateField.day)).toBe(date.getDate()));
	test('hours', () => expect(_get(date, DateField.hour)).toBe(date.getHours()));
	test('minutes', () => expect(_get(date, DateField.minute)).toBe(date.getMinutes()));
	test('seconds', () => expect(_get(date, DateField.second)).toBe(date.getSeconds()));
	test('milliseconds', () => expect(_get(date, DateField.millisecond)).toBe(date.getMilliseconds()));
});

describe('"_get" UTC method values equal the constant values', () => {
	const year = 2022;
	const month = 7;
	const day = 22;
	const hours = 13;
	const minutes = 48;
	const seconds = 59;
	const milliseconds = 300;
	const date = new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds));

	test('year', () => expect(_get(date, DateField.year, true)).toBe(year));
	test('month', () => expect(_get(date, DateField.month, true)).toBe(month));
	test('day', () => expect(_get(date, DateField.day, true)).toBe(day));
	test('hours', () => expect(_get(date, DateField.hour, true)).toBe(hours));
	test('minutes', () => expect(_get(date, DateField.minute, true)).toBe(minutes));
	test('seconds', () => expect(_get(date, DateField.second, true)).toBe(seconds));
	test('milliseconds', () => expect(_get(date, DateField.millisecond, true)).toBe(milliseconds));
});

describe('"_get" UTC method values equal corresponding value from native date method', () => {
	const year = 2022;
	const month = 7;
	const day = 22;
	const hours = 13;
	const minutes = 48;
	const seconds = 59;
	const milliseconds = 300;
	const date = new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds));

	test('year', () => expect(_get(date, DateField.year, true)).toBe(date.getUTCFullYear()));
	test('month', () => expect(_get(date, DateField.month, true)).toBe(date.getUTCMonth()));
	test('day', () => expect(_get(date, DateField.day, true)).toBe(date.getUTCDate()));
	test('hours', () => expect(_get(date, DateField.hour, true)).toBe(date.getUTCHours()));
	test('minutes', () => expect(_get(date, DateField.minute, true)).toBe(date.getUTCMinutes()));
	test('seconds', () => expect(_get(date, DateField.second, true)).toBe(date.getUTCSeconds()));
	test('milliseconds', () => expect(_get(date, DateField.millisecond, true)).toBe(date.getUTCMilliseconds()));
});

describe('Date from Array', () => {
	const { date, dateTime } = _createDatesFromArray([ 1942, 8, 2, 19, 4, 58, 205 ]);

	test('DateTime value equals native date', () => expect(dateTime.valueOf()).toEqual(date.valueOf()));
	test('DateTime internal date equals native date', () => expect(dateTime.toDate()).toStrictEqual(date));
	test('Method values equal corresponding value from native date method', () => _checkDateProperties('Date from Array properties', dateTime, date));
});

describe('UTC Date from Array', () => {
	const { date, dateTime } = _createDatesFromArray([ 1942, 8, 2, 19, 4, 58, 205 ], true);

	test('DateTime value equals native date', () => expect(dateTime.valueOf()).toEqual(date.valueOf()));
	test('DateTime internal date equals native date', () => expect(dateTime.toDate()).toStrictEqual(date));
	test('Method values equal corresponding value from native date method', () => _checkDateProperties('UTC Date from Array properties', dateTime, date));
});

describe('Ancient Date from Array', () => {
	const { date, dateTime } = _createDatesFromArray([ 86, 2, 28, 4, 12, 23, 732 ]);

	test('DateTime value equals native date', () => expect(dateTime.valueOf()).toEqual(date.valueOf()));
	test('DateTime internal date equals native date', () => expect(dateTime.toDate()).toStrictEqual(date));
	test('Method values equal corresponding value from native date method', () => _checkDateProperties('Ancient Date from Array properties', dateTime, date));
});

describe('Ancient UTC Date from Array', () => {
	const { date, dateTime } = _createDatesFromArray([ 86, 2, 28, 4, 12, 23, 732 ], true);

	test('DateTime value equals native date', () => expect(dateTime.valueOf()).toEqual(date.valueOf()));
	test('DateTime internal date equals native date', () => expect(dateTime.toDate()).toStrictEqual(date));
	test('Method values equal corresponding value from native date method', () => _checkDateProperties('Ancient UTC Date from Array properties', dateTime, date));
});

// describe('Day of Year', () => {
// 	const dates = { 'Leap Year': new Date(2021, 0, 1), 'Non-Leap Year': new Date(2022, 0, 1) };

// 	for (const [type, date] of Object.entries(dates)) {
// 		for (let i = 1, length = _isLeapYear(date) ? 366 : 365, baseDate; i <= length; i++) {
// 			date.setDate(i);
// 			baseDate = new BaseDate(date);
// 			test(`Day of year (${i}) in ${type} equals calculated day of year`, () => expect(_dayOfYear(baseDate.year, baseDate.month, baseDate.day)).toBe(_calculateDayOfYear(date)));
// 		}
// 	}
// });

// describe('Leap Year', () => {
// 	// There are 30 leap years between 1900 and 2020
// 	const leapYears = [	1904, 1908, 1912, 1916, 1920, 1924, 1928, 1932, 1936, 1940, 1944, 1948, 1952, 1956, 1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020 ];

// 	for (let i = 1900; i <= 2020; i++) {
// 		test(`Is ${i} a leap year`, () => expect(_isLeapYear(i)).toBe(leapYears.includes(i)));
// 	}
// });

// describe('Daylight Savings Time', () => {
// 	const dstStart = new Date(2022, 2, 13, 2);
// 	const dstEnd = new Date(2022, 10, 6, 2);
// 	const ancientDate = _dateFromArray([1, 1, 1, 0, 0, 0, 0]);

// 	test('Ancient Date', () => expect(_isDaylightSavingsTime(new BaseDate(ancientDate))).toBe(_isDST(ancientDate)));
// 	test('DST Start', () => expect(_isDaylightSavingsTime(new BaseDate(dstStart))).toBe(_isDST(dstStart)));
// 	test('DST End', () => expect(_isDaylightSavingsTime(new BaseDate(dstEnd))).toBe(_isDST(dstEnd)));

// 	const beforeDST = new Date(2022, 2, 13, 1, 59, 59, 999);
// 	test('1 Millisecond Before DST Start', () => expect(_isDaylightSavingsTime(new BaseDate(beforeDST))).toBe(_isDST(beforeDST)));
// 	const beforeST = new Date(2022, 10, 6, 1, 59, 59, 999);
// 	test('1 Millisecond Before DST Ends', () => expect(_isDaylightSavingsTime(new BaseDate(beforeST))).toBe(_isDST(beforeST)));
// });

// describe('Format Time Zone', () => {
// 	const date = new Date();
// 	const localeName = i18n.locale;
// 	const dateTimeFormatter = Intl.DateTimeFormat(localeName, { timeZoneName: i18n.timeZoneFormats.SHORT });
// 	const longDateTimeFormatter = Intl.DateTimeFormat(localeName, { timeZoneName: i18n.timeZoneFormats.LONG });

// 	test('Current Time Zone', () => expect(_getTimeZone(date, dateTimeFormatter)).toBe(dateTimeFormatter.formatToParts(date).find((part) => part.type == 'timeZoneName').value));
// 	test('Current Time Zone', () => expect(_getTimeZone(date, longDateTimeFormatter)).toBe(longDateTimeFormatter.formatToParts(date).find((part) => part.type == 'timeZoneName').value));

// 	// Daylight Savings Time started Sunday, April 7th at 2am in 2002.
// 	const standardDate = _dateFromArray([2002, 3, 10, 14, 35, 58, 156]);
// 	test('Current Time Zone', () => expect(_getTimeZone(standardDate, dateTimeFormatter)).toBe(dateTimeFormatter.formatToParts(standardDate).find((part) => part.type == 'timeZoneName').value));
// 	test('Current Time Zone', () => expect(_getTimeZone(standardDate, longDateTimeFormatter)).toBe(longDateTimeFormatter.formatToParts(standardDate).find((part) => part.type == 'timeZoneName').value));

// 	const daylightSavingsDate = _dateFromArray([2002, 4, 7, 2, 35, 58, 156]);
// 	test('Current Time Zone', () => expect(_getTimeZone(daylightSavingsDate, dateTimeFormatter)).toBe(dateTimeFormatter.formatToParts(daylightSavingsDate).find((part) => part.type == 'timeZoneName').value));
// 	test('Current Time Zone', () => expect(_getTimeZone(daylightSavingsDate, longDateTimeFormatter)).toBe(longDateTimeFormatter.formatToParts(daylightSavingsDate).find((part) => part.type == 'timeZoneName').value));

// 	const ancientDate = _dateFromArray([1, 4, 7, 2, 35, 58, 156]);
// 	test('Current Time Zone', () => expect(_getTimeZone(ancientDate, dateTimeFormatter)).toBe(dateTimeFormatter.formatToParts(ancientDate).find((part) => part.type == 'timeZoneName').value));
// 	test('Current Time Zone', () => expect(_getTimeZone(ancientDate, longDateTimeFormatter)).toBe(longDateTimeFormatter.formatToParts(ancientDate).find((part) => part.type == 'timeZoneName').value));
// });

describe('Start of', () => {
	let currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();
	const currentDay = currentDate.getDate();
	const currentHour = currentDate.getHours();
	const currentMinute = currentDate.getMinutes();
	const currentSecond = currentDate.getSeconds();

	test('Start of Year', () => expect(_startOf(new BaseDateTime(), DateTimeUnit.YEAR).date).toEqual(new Date(currentYear, 0, 1, 0, 0, 0, 0)));

	test('Start of Month', () => expect(_startOf(new BaseDateTime(), DateTimeUnit.MONTH).date).toEqual(new Date(currentYear, currentMonth, 1, 0, 0, 0, 0)));

	test('Start of Day', () => expect(_startOf(new BaseDateTime(), DateTimeUnit.DAY).date).toEqual(new Date(currentYear, currentMonth, currentDay, 0, 0, 0, 0)));

	test('Start of Hour', () => expect(_startOf(new BaseDateTime(), DateTimeUnit.HOUR).date).toEqual(new Date(currentYear, currentMonth, currentDay, currentHour, 0, 0, 0)));

	test('Start of Minute', () => expect(_startOf(new BaseDateTime(), DateTimeUnit.MINUTE).date).toEqual(new Date(currentYear, currentMonth, currentDay, currentHour, currentMinute, 0, 0)));

	test('Start of Second', () => expect(_startOf(new BaseDateTime(), DateTimeUnit.SECOND).date).toEqual(new Date(currentYear, currentMonth, currentDay, currentHour, currentMinute, currentSecond, 0)));
});

describe('Splice', () => {
	it('Should inject ":" into middle of string ', () => expect(_splice('0400', 0, ':')).toBe(':0400'));
	it('Should inject ":" into middle of string ', () => expect(_splice('0400', 1, ':')).toBe('0:400'));
	it('Should inject ":" into middle of string ', () => expect(_splice('0400', 2, ':')).toBe('04:00'));
});

// describe('Type', () => {
// 	it('Object Should have the correct "type"', () => expect(_type({})).toBe('Object'));
// 	it('Array Should have the correct "type"', () => expect(_type([])).toBe('Array'));
// 	it('String Should have the correct "type"', () => expect(_type('')).toBe('String'));
// 	it('Date Should have the correct "type"', () => expect(_type(new Date())).toBe('Date'));
// 	it('ClonedDate Should have the correct "type"', () => expect(_type(new BaseDateTime())).toBe('BaseDateTime'));
// 	it('RegExp Should have the correct "type"', () => expect(_type(new RegExp(/^.*$/))).toBe('RegExp'));
// 	it('Function Should have the correct "type"', () => expect(_type(() => {})).toBe('Function'));
// 	it('Boolean Should have the correct "type"', () => expect(_type(false)).toBe('Boolean'));
// 	it('Number Should have the correct "type"', () => expect(_type(5.34)).toBe('Number'));
// 	it('Symbol Should have the correct "type"', () => expect(_type(Symbol('MySymbol'))).toBe('Symbol'));
// 	it('DateTime Should have the correct "type"', () => expect(_type(new DateTime())).toBe('DateTime'));
// 	it('Locale Should have the correct "type"', () => expect(_type(new Locale(localeOptions))).toBe('Locale'));
// 	it('Duration Should have the correct "type"', () => expect(_type(new Duration({ days: 1 }))).toBe('Duration'));
// 	it('Period Should have the correct "type"', () => expect(_type(new Period(1, 'Day'))).toBe('Period'));
// 	it('Null Should have the correct "type"', () => expect(_type(null)).toBe('Null'));
// 	it('Undefined Should have the correct "type"', () => expect(_type(undefined)).toBe('Undefined'));
// });