import MockDate from 'mockdate';
import { beforeEach, afterEach, expect, describe, test } from '@jest/globals';
import { _set, _get, _descendingComparator, _startOf, dateTimeFields, dateTimeUnits } from '../src/js/constants.js';

describe('_set', () => {
	beforeEach(() => MockDate.set(new Date()));
	afterEach(() => MockDate.reset());

	const year = 2048;
	const month = 11;
	const day = 25;
	const hours = 23;
	const minutes = 59;
	const seconds = 59;
	const milliseconds = 999;
	const date1 = new Date();
	const date2 = new Date();

	describe('Date mutated from internal function should match date mutated from native method', () => {
		test('year', () => expect(_set(date1, dateTimeFields.YEAR, year)).toBe(date2.setFullYear(year)));
		test('month', () => expect(_set(date1, dateTimeFields.MONTH, month)).toBe(date2.setMonth(month)));
		test('day', () => expect(_set(date1, dateTimeFields.DAY, day)).toBe(date2.setDate(day)));
		test('hours', () => expect(_set(date1, dateTimeFields.HOURS, hours)).toBe(date2.setHours(hours)));
		test('minutes', () => expect(_set(date1, dateTimeFields.MINUTES, minutes)).toBe(date2.setMinutes(minutes)));
		test('seconds', () => expect(_set(date1, dateTimeFields.SECONDS, seconds)).toBe(date2.setSeconds(seconds)));
		test('milliseconds', () => expect(_set(date1, dateTimeFields.MILLISECONDS, milliseconds)).toBe(date2.setMilliseconds(milliseconds)));
	});
});

describe('_get UTC', () => {
	const year = 2022;
	const month = 7;
	const day = 22;
	const hours = 13;
	const minutes = 48;
	const seconds = 59;
	const milliseconds = 300;
	const date = new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds));

	describe('Method values equal the constant values', () => {
		test('year', () => expect(_get(date, dateTimeFields.YEAR, true)).toBe(year));
		test('month', () => expect(_get(date, dateTimeFields.MONTH, true)).toBe(month));
		test('day', () => expect(_get(date, dateTimeFields.DAY, true)).toBe(day));
		test('hours', () => expect(_get(date, dateTimeFields.HOURS, true)).toBe(hours));
		test('minutes', () => expect(_get(date, dateTimeFields.MINUTES, true)).toBe(minutes));
		test('seconds', () => expect(_get(date, dateTimeFields.SECONDS, true)).toBe(seconds));
		test('milliseconds', () => expect(_get(date, dateTimeFields.MILLISECONDS, true)).toBe(milliseconds));
	});

	describe('Method values equal corresponding value from native date method', () => {
		test('year', () => expect(_get(date, dateTimeFields.YEAR, true)).toBe(date.getUTCFullYear()));
		test('month', () => expect(_get(date, dateTimeFields.MONTH, true)).toBe(date.getUTCMonth()));
		test('day', () => expect(_get(date, dateTimeFields.DAY, true)).toBe(date.getUTCDate()));
		test('hours', () => expect(_get(date, dateTimeFields.HOURS, true)).toBe(date.getUTCHours()));
		test('minutes', () => expect(_get(date, dateTimeFields.MINUTES, true)).toBe(date.getUTCMinutes()));
		test('seconds', () => expect(_get(date, dateTimeFields.SECONDS, true)).toBe(date.getUTCSeconds()));
		test('milliseconds', () => expect(_get(date, dateTimeFields.MILLISECONDS, true)).toBe(date.getUTCMilliseconds()));
	});
});

describe('_get', () => {
	const year = 2022;
	const month = 7;
	const day = 22;
	const hours = 13;
	const minutes = 48;
	const seconds = 59;
	const milliseconds = 300;
	const date = new Date(year, month, day, hours, minutes, seconds, milliseconds);

	describe('Method values equal the constant values', () => {
		test('year', () => expect(_get(date, dateTimeFields.YEAR)).toBe(year));
		test('month', () => expect(_get(date, dateTimeFields.MONTH)).toBe(month));
		test('day', () => expect(_get(date, dateTimeFields.DAY)).toBe(day));
		test('hours', () => expect(_get(date, dateTimeFields.HOURS)).toBe(hours));
		test('minutes', () => expect(_get(date, dateTimeFields.MINUTES)).toBe(minutes));
		test('seconds', () => expect(_get(date, dateTimeFields.SECONDS)).toBe(seconds));
		test('milliseconds', () => expect(_get(date, dateTimeFields.MILLISECONDS)).toBe(milliseconds));
	});

	describe('Method values equal corresponding value from native date method', () => {
		test('year', () => expect(_get(date, dateTimeFields.YEAR)).toBe(date.getFullYear()));
		test('month', () => expect(_get(date, dateTimeFields.MONTH)).toBe(date.getMonth()));
		test('day', () => expect(_get(date, dateTimeFields.DAY)).toBe(date.getDate()));
		test('hours', () => expect(_get(date, dateTimeFields.HOURS)).toBe(date.getHours()));
		test('minutes', () => expect(_get(date, dateTimeFields.MINUTES)).toBe(date.getMinutes()));
		test('seconds', () => expect(_get(date, dateTimeFields.SECONDS)).toBe(date.getSeconds()));
		test('milliseconds', () => expect(_get(date, dateTimeFields.MILLISECONDS)).toBe(date.getMilliseconds()));
	});
});

describe('_get UTC', () => {
	const year = 2022;
	const month = 7;
	const day = 22;
	const hours = 13;
	const minutes = 48;
	const seconds = 59;
	const milliseconds = 300;
	const date = new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds));

	describe('Method values equal the constant values', () => {
		test('year', () => expect(_get(date, dateTimeFields.YEAR, true)).toBe(year));
		test('month', () => expect(_get(date, dateTimeFields.MONTH, true)).toBe(month));
		test('day', () => expect(_get(date, dateTimeFields.DAY, true)).toBe(day));
		test('hours', () => expect(_get(date, dateTimeFields.HOURS, true)).toBe(hours));
		test('minutes', () => expect(_get(date, dateTimeFields.MINUTES, true)).toBe(minutes));
		test('seconds', () => expect(_get(date, dateTimeFields.SECONDS, true)).toBe(seconds));
		test('milliseconds', () => expect(_get(date, dateTimeFields.MILLISECONDS, true)).toBe(milliseconds));
	});

	describe('Method values equal corresponding value from native date method', () => {
		test('year', () => expect(_get(date, dateTimeFields.YEAR, true)).toBe(date.getUTCFullYear()));
		test('month', () => expect(_get(date, dateTimeFields.MONTH, true)).toBe(date.getUTCMonth()));
		test('day', () => expect(_get(date, dateTimeFields.DAY, true)).toBe(date.getUTCDate()));
		test('hours', () => expect(_get(date, dateTimeFields.HOURS, true)).toBe(date.getUTCHours()));
		test('minutes', () => expect(_get(date, dateTimeFields.MINUTES, true)).toBe(date.getUTCMinutes()));
		test('seconds', () => expect(_get(date, dateTimeFields.SECONDS, true)).toBe(date.getUTCSeconds()));
		test('milliseconds', () => expect(_get(date, dateTimeFields.MILLISECONDS, true)).toBe(date.getUTCMilliseconds()));
	});
});

describe('Descending Comparator', () => {
	const array = [ 5, 10586, 56, 8999, 8989, 1024, 51215888 ];

	test('Sort', () => expect(array.sort(_descendingComparator)).toEqual(array.sort().reverse()));
});

describe('Start of', () => {
	let currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();
	const currentDay = currentDate.getDate();
	const currentHour = currentDate.getHours();
	const currentMinute = currentDate.getMinutes();
	const currentSecond = currentDate.getSeconds();

	const startOfYear = new Date();
	_startOf(startOfYear, dateTimeUnits.YEAR);
	test('Start of Year', () => expect(startOfYear).toEqual(new Date(currentYear, 0, 1, 0, 0, 0, 0)));

	const startOfMonth = new Date();
	_startOf(startOfMonth, dateTimeUnits.MONTH);
	test('Start of Month', () => expect(startOfMonth).toEqual(new Date(currentYear, currentMonth, 1, 0, 0, 0, 0)));

	const startOfDay = new Date();
	_startOf(startOfDay, dateTimeUnits.DAY);
	test('Start of Day', () => expect(startOfDay).toEqual(new Date(currentYear, currentMonth, currentDay, 0, 0, 0, 0)));

	const startOfHour = new Date();
	_startOf(startOfHour, dateTimeUnits.HOUR);
	test('Start of Hour', () => expect(startOfHour).toEqual(new Date(currentYear, currentMonth, currentDay, currentHour, 0, 0, 0)));

	const startOfMinute = new Date();
	_startOf(startOfMinute, dateTimeUnits.MINUTE);
	test('Start of Minute', () => expect(startOfMinute).toEqual(new Date(currentYear, currentMonth, currentDay, currentHour, currentMinute, 0, 0)));

	const startOfSecond = new Date();
	_startOf(startOfSecond, dateTimeUnits.SECOND);
	test('Start of Second', () => expect(startOfSecond).toEqual(new Date(currentYear, currentMonth, currentDay, currentHour, currentMinute, currentSecond, 0)));
});