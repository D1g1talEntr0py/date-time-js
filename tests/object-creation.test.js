// @ts-nocheck
import { DateTime } from './module.js?locale=en-US&global=true';
import { expect, describe, test } from '@jest/globals';
import { _checkDateProperties, _createCurrentUtcDate } from './test.utilities.js';

test('Invalid Date', () => expect(new DateTime('date').toDate().toString()).toBe('Invalid Date'));

describe('utc', () => {
	test.each([
		['No Parameters', DateTime.utc(), _createCurrentUtcDate()],
		['"pattern" Parameter', DateTime.utc('06.19.2022 3:30 PM', { pattern: 'MM.DD.YYYY h:mm A' }), new Date(Date.UTC(2022, 5, 19, 15, 30))],
		// TODO - Figure out how to test this properly.
		['"locale" Parameter', DateTime.utc('06.19.2022 3:30 PM', { pattern: 'MM.DD.YYYY h:mm A', locale: 'en-US' }), new Date(Date.UTC(2022, 5, 19, 15, 30))]
	])('Check DateTime properties using static method with "%s"', _checkDateProperties);
});

describe('parse', () => {
	test.each([
		['Required Parameters (date, pattern)', DateTime.parse('10_14_1986', 'MM_DD_YYYY'), new Date(1986, 9, 14)],
		['"utc" Parameter', DateTime.parse('10_14_1986', 'MM_DD_YYYY', { utc: true }), new Date(Date.UTC(1986, 9, 14))],
		// TODO - Figure out how to test this properly.
		['"locale" Pattern', DateTime.parse('10_14_1986', 'MM_DD_YYYY', { locale: 'en-US'}), new Date(1986, 9, 14)]
	])('Check DateTime properties using static method with "%s"', _checkDateProperties);
});

describe('Modern Dates', () => {
	const currentDate = new Date();
	const currentUTCDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()));
	const pastDate = new Date(1986, 9, 14, 22, 5, 18, 334);

	test.each([
		['default', new DateTime(), currentDate],
		['Date', new DateTime(currentDate), currentDate],
		['Number', new DateTime(currentDate.getTime()), new Date(currentDate.getTime())],
		['String', new DateTime('1986-10-14T22:05:18.334'), pastDate],
		['Array', new DateTime([1986, 10, 14, 22, 5, 18, 334]), pastDate],
		['undefined', new DateTime(undefined), new Date()]
	])('Check DateTime properties using "%s" constructor', _checkDateProperties);

	const pastUtcDate = new Date(Date.UTC(1986, 9, 14, 22, 5, 18, 334));

	test.each([
		['Date', new DateTime(pastUtcDate, { utc: true }), pastUtcDate],
		['Number', new DateTime(pastUtcDate.valueOf(), { utc: true }), pastUtcDate],
		['String', new DateTime('1986-10-14T22:05:18.334', { utc: true }), pastUtcDate],
		['Array', new DateTime([1986, 10, 14, 22, 5, 18, 334], { utc: true }), pastUtcDate],
		['undefined', new DateTime(undefined, { utc: true }), _createCurrentUtcDate()],
		['Object', new DateTime({ utc: true }), _createCurrentUtcDate()]
	])('Check DateTime properties using "%s" constructor with the UTC parameter option', _checkDateProperties);

	test.each([
		['parse', DateTime.parse('19861014 10:8:2', 'YYYYMMDD hh:m:s'), new Date(1986, 9, 14, 10, 8, 2)],
		['utc', DateTime.utc('19861014 10:8:2', { pattern: 'YYYYMMDD hh:m:s' }), new Date(Date.UTC(1986, 9, 14, 10, 8, 2))],
		['startOf', DateTime.startOf(DateTime.Unit.YEAR), new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0)]
	])('Check properties using static %s method', _checkDateProperties);
});

describe('Ancient Dates', () => {
	const dateValues = [1, 0, 1, 0, 0, 0, 0];
	const date = new Date(...dateValues);
	date.setFullYear(1);

	test.each([
		['Date', new DateTime(date), date],
		['Number', new DateTime(date.getTime()), new Date(date.getTime())],
		['String', new DateTime('0001-01-01T00:00:00.000'), date],
		['Array', new DateTime([1, 1, 1, 0, 0, 0, 0]), date]
	])('Check DateTime properties using "%s" constructor', _checkDateProperties);

	const utcDate = new Date(Date.UTC(...dateValues));
	utcDate.setUTCFullYear(1);

	test.each([
		['Date', new DateTime(utcDate, { utc: true }), utcDate],
		['Number', new DateTime(utcDate.valueOf(), { utc: true }), utcDate],
		['String', new DateTime('0001-01-01T00:00:00.000Z'), utcDate],
		['Array', new DateTime([1, 1, 1, 0, 0, 0, 0], { utc: true }), utcDate]
	])('Check DateTime properties using "%s" constructor with the UTC parameter option', _checkDateProperties);

	test.each([
		['parse', DateTime.parse('00010101 00:0:0.0', 'YYYYMMDD HH:m:s.S'), date],
		['utc', DateTime.utc('00010101 00:0:0.0', { pattern: 'YYYYMMDD HH:m:s.S' }), utcDate]
	])('Check properties using static %s method', _checkDateProperties);
});

describe('Type checks', () => {
	const dateTime = new DateTime();

	test('Instance Of', () => expect(dateTime).toBeInstanceOf(DateTime));
	test('Instance Of', () => expect(dateTime).not.toBeInstanceOf(Date));
	test('Type Of', () => expect(typeof(dateTime) == 'object').toBe(true));
	test('Is DateTime', () => expect(dateTime.constructor == DateTime).toBe(true));
});

describe('Start of', () => {
	let currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();
	const currentDay = currentDate.getDate();
	const currentHour = currentDate.getHours();
	const currentMinute = currentDate.getMinutes();
	const currentSecond = currentDate.getSeconds();

	const startOfYearDateTime = DateTime.startOf(DateTime.Unit.YEAR);
	const startOfYearDate = new Date(currentYear, 0, 1, 0, 0, 0, 0);
	test('Start of Year', () => expect(startOfYearDateTime).toEqual(new DateTime(startOfYearDate)));

	const startOfMonthDateTime = DateTime.startOf(DateTime.Unit.MONTH);
	const startOfMonthDate = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
	test('Start of Month', () => expect(startOfMonthDateTime).toEqual(new DateTime(startOfMonthDate)));

	const startOfDayDateTime = DateTime.startOf(DateTime.Unit.DAY);
	const startOfDayDate = new Date(currentYear, currentMonth, currentDay, 0, 0, 0, 0);
	test('Start of Day', () => expect(startOfDayDateTime).toEqual(new DateTime(startOfDayDate)));

	const startOfHourDateTime = DateTime.startOf(DateTime.Unit.HOUR);
	const startOfHourDate = new Date(currentYear, currentMonth, currentDay, currentHour, 0, 0, 0);
	test('Start of Hour', () => expect(startOfHourDateTime).toEqual(new DateTime(startOfHourDate)));

	const startOfMinuteDateTime = DateTime.startOf(DateTime.Unit.MINUTE);
	const startOfMinuteDate = new Date(currentYear, currentMonth, currentDay, currentHour, currentMinute, 0, 0);
	test('Start of Minute', () => expect(startOfMinuteDateTime).toEqual(new DateTime(startOfMinuteDate)));

	const startOfSecondDateTime = DateTime.startOf(DateTime.Unit.SECOND);
	const startOfSecondDate = new Date(currentYear, currentMonth, currentDay, currentHour, currentMinute, currentSecond, 0);
	test('Start of Second', () => expect(startOfSecondDateTime).toEqual(new DateTime(startOfSecondDate)));

	test.each([
		['Start of Year', startOfYearDateTime, startOfYearDate],
		['Start of Month', startOfMonthDateTime, startOfMonthDate],
		['start of Day', startOfDayDateTime, startOfDayDate],
		['Start of Hour', startOfHourDateTime, startOfHourDate],
		['Start of Minute', startOfMinuteDateTime, startOfMinuteDate],
		['Start of Second', startOfSecondDateTime, startOfSecondDate]
	])('Check %s DateTime created with "startOf" static method', _checkDateProperties);
});