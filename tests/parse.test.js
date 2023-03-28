// @ts-nocheck
import { DateTime } from './test-module.js?locale=en-US&global=true';
import { _dateFromArray } from '../src/utils.js';
import { describe, expect, test } from '@jest/globals';
import { _checkDateProperties } from './test.utilities.js';

describe('Parse Local ISO Dates and Times', () => {

	test('Ancient Date', () => {
		const date = '0001-01-01';
		const dateTime = new DateTime([1, 1, 1]);
		const firstDate = _dateFromArray([1, 1, 1]);

		expect(dateTime.isValid()).toBe(true);
		expect(dateTime.valueOf()).toBe(firstDate.valueOf());
		expect(dateTime.isDaylightSavingsTime()).toBe(false);
		expect(dateTime.setMonth(6).isDaylightSavingsTime()).toBe(false);
		expect(dateTime.isUtc()).toBe(false);
		expect(dateTime.format(DateTime.Pattern.ISO_DATE)).toBe(date);
		expect(dateTime.isLeapYear()).toBe(false);
	});

	test('Now', () => expect(new DateTime().valueOf()).toBe(new Date().valueOf()));

	test('parse and format dates', () => {
		let dateString = '20130108';
		expect(DateTime.parse(dateString, 'YYYYMMDD').valueOf()).toBe(new Date(2013, 0, 8).valueOf());
		dateString = '2018-04-24';
		expect(new DateTime(dateString).valueOf()).toBe(new Date(2018, 3, 24).valueOf());
		dateString = '2018-04-24 11:12';
		expect(new DateTime(dateString).format()).toBe(new DateTime(new Date(2018, 3, 24, 11, 12).valueOf()).format()); // not recommend
		dateString = '2018-05-02 11:12:13';
		expect(new DateTime(dateString).valueOf()).toBe(new Date(2018, 4, 2, 11, 12, 13).valueOf());
		dateString = '2018-05-02 11:12:13.998';
		expect(new DateTime(dateString).valueOf()).toBe(new Date(2018, 4, 2, 11, 12, 13, 998).valueOf());
		dateString = '2018-4-1';
		expect(DateTime.parse(dateString, 'YYYY-M-D').valueOf()).toBe(new Date(2018, 3, 1).valueOf()); // not recommend
		dateString = '2018-4-1 11:12';
		expect(DateTime.parse(dateString, 'YYYY-M-D hh:mm').format()).toBe(new DateTime(new Date(2018, 3, 1, 11, 12).valueOf()).format()); // not recommend
		dateString = '2018-4-1 1:1:1:223';
		expect(DateTime.parse(dateString, 'YYYY-M-D h:m:s:SSS').valueOf()).toBe(new Date(2018, 3, 1, 1, 1, 1, 223).valueOf()); // not recommend
		dateString = '2018-01';
		expect(DateTime.parse(dateString, 'YYYY-MM').valueOf()).toBe(new Date(2018, 0).valueOf()); // not recommend
		dateString = '2018';
		expect(DateTime.parse(dateString, 'YYYY').format()).toBe(new DateTime(new Date(2018, 0).valueOf()).format()); // not recommend
		dateString = '2018-05-02T11:12:13Z';
		expect(new DateTime(dateString).valueOf()).toBe(new Date(Date.UTC(2018, 4, 2, 11, 12, 13)).valueOf()); // not recommend
	});

	test('String ISO 8601 date, time and zone', () => {
		const time = '2018-04-04T16:00:00.000Z';
		expect(new DateTime(time).valueOf()).toBe(new Date(Date.UTC(2018, 3, 4, 16)).valueOf());
	});

	test('String en-US Locale date, time and zone', () => {
		const time = '04/04/2018 04:00:00 PM';
		expect(new DateTime(time).valueOf()).toBe(new Date(2018, 3, 4, 16).valueOf());
	});

	test('Arrays with time part', () => {
		const dateValues = [2018, 5, 1, 13, 52, 44];
		expect(new DateTime(dateValues).isValid()).toBe(true);
		expect(new DateTime(dateValues).valueOf()).toBe(new Date(2018, 4, 1, 13, 52, 44).valueOf());
	});

	test('rejects invalid values', () => {
		expect(new DateTime(null).isValid()).toBe(false);
		expect(new DateTime(() => '2018-01-01').isValid()).toBe(false);
		expect(new DateTime(Infinity).isValid()).toBe(false);
		expect(new DateTime(NaN).isValid()).toBe(false);
	});

	test('parses Arrays with date part', () => {
		const dateTime = new DateTime([2018, 5, 1]);
		const date = new Date(2018, 4, 1);

		// Method values equal corresponding value from native date method
		_checkDateProperties('Past DateTime created by an array', dateTime, date);
		expect(dateTime.valueOf()).toBe(date.valueOf());
	});

	test('parses millisecond up to 9 digits', () => {
		const date = '2019-03-25T06:41:00.999999999';
		const ds = new DateTime(date);
		const ms = new Date(2019, 2, 25, 6, 41, 0, 999);
		expect(ds.valueOf()).toEqual(ms.valueOf());
		expect(ds.getMillisecond()).toEqual(ms.getMilliseconds());
	});

	test('String Other, Undefined and Null and isValid', () => {
		expect(new DateTime('otherString').toString().toUpperCase()).toBe(new Date('otherString').toString().toUpperCase());
		expect(new DateTime().isValid()).toBe(true);
		expect(new DateTime(undefined).isValid()).toBe(true);
		expect(new DateTime('').isValid()).toBe(false);
		expect(new DateTime(null).isValid()).toBe(false);
		expect(new DateTime('otherString').isValid()).toBe(false);
		expect(new DateTime(undefined).toDate().toString().toUpperCase()).toBe(new Date().toString().toUpperCase());
	});
});

test('Epoch Timestamp Number (milliseconds) 1523520536000', () => {
	const timestamp = 1523520536000;
	expect(new DateTime(timestamp).valueOf()).toBe(new Date(timestamp).valueOf());
});

test('String and Number 20180101', () => {
	expect(new DateTime(20180101).valueOf()).toBe(new Date(20180101).valueOf());
	expect(DateTime.parse('20180101', 'YYYYMMDD').valueOf()).toBe(new Date(2018, 0, 1).valueOf());
});

test('Number 0', () => {
	expect(new DateTime(0).valueOf()).toBe(new Date(0).valueOf());
});

test('Clone not affect each other', () => {
	const base = new DateTime('2017-01-01');
	const another = base.add(1, DateTime.Period.YEARS);
	expect(base.getYear()).toBe(2017);
	expect(another.getYear()).toBe(2018);
	expect(base.diff(another, DateTime.Period.YEARS)).toBe(1);
});

test('Clone with same value', () => {
	const base = new DateTime();
	const year = base.getYear();
	const newBase = base.set(DateTime.Unit.YEAR, year + 1);
	const another = new DateTime(newBase.valueOf());
	expect(newBase.toString()).toBe(another.toString());
});