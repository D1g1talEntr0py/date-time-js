import { describe, expect, test } from '@jest/globals';
import BaseDateTime from '../src/base-date-time.js';
import { DateField, DateTimeUnit } from '../src/constants.js';
import { _get, _set, _startOf } from '../src/utils.js';
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