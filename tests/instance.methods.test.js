import { describe, expect, it, test } from '@jest/globals';
import { DateTime } from './module.js?locale=en-US&global=true';
import { _createCurrentUtcDate, _createDatesFromArray } from './test.utilities.js';

describe('Start of', () => {
	const parsableDate = '2014-06-05T19:42:54.309Z';
	const year = 2014;
	const month = 6;
	const day = 5;
	const hour = 19;
	const minute = 42;
	const second = 54;
	// Parsed as UTC as it has a 'Z' suffix.
	let dateTime = new DateTime(parsableDate);

	test('Start of returns new instance of DateTime object ensuring immutability', () => expect(dateTime.startOf(DateTime.Unit.YEAR)).not.toBe(dateTime));
	test('Start of Year', () => expect(dateTime.startOf(DateTime.Unit.YEAR)).toEqual(DateTime.utc([year, 1, 1, 0, 0, 0, 0])));
	test('Start of Month', () => expect(dateTime.startOf(DateTime.Unit.MONTH)).toEqual(DateTime.utc([year, month, 1, 0, 0, 0, 0])));
	test('Start of Day', () => expect(dateTime.startOf(DateTime.Unit.DAY)).toEqual(DateTime.utc([year, month, day, 0, 0, 0, 0])));
	test('Start of Hour', () => expect(dateTime.startOf(DateTime.Unit.HOUR)).toEqual(DateTime.utc([year, month, day, hour, 0, 0, 0])));
	test('Start of Minute', () => expect(dateTime.startOf(DateTime.Unit.MINUTE)).toEqual(DateTime.utc([year, month, day, hour, minute, 0, 0])));
	test('Start of Second', () => expect(dateTime.startOf(DateTime.Unit.SECOND)).toEqual(DateTime.utc([year, month, day, hour, minute, second, 0])));
});

describe('local', () => {
	const currentUtcDate = _createCurrentUtcDate();
	const currentUtcDateTime = DateTime.utc();

	test('Method returns new instance of DateTime object ensuring immutability', () => expect(currentUtcDateTime.local()).not.toBe(currentUtcDateTime));
	test('Convert Current UTC DateTime to Local DateTime', () => expect(currentUtcDateTime.local()).toEqual(new DateTime(currentUtcDate)));
	test('Convert Current UTC DateTime to Date', () => expect(currentUtcDateTime.local().toDate()).toEqual(currentUtcDate));

	const pastUtcDate = new Date(Date.UTC(2011, 10, 5, 12, 45, 12, 901));
	const pastUtcDateTime = DateTime.utc([2011, 11, 5, 12, 45, 12, 901]);

	test('Convert Past UTC DateTime to Local DateTime', () => expect(pastUtcDateTime.local()).toEqual(new DateTime(pastUtcDate)));
	test('Convert Past UTC DateTime to Date', () => expect(pastUtcDateTime.local().toDate()).toEqual(pastUtcDate));
});

describe('utc', () => {
	const currentDateTime = new DateTime();
	const currentUtcDate = _createCurrentUtcDate();

	test('Method returns new instance of DateTime object ensuring immutability', () => expect(currentDateTime.utc()).not.toBe(currentDateTime));
	test('Convert Current DateTime to UTC DateTime', () => expect(currentDateTime.utc()).toEqual(new DateTime(currentUtcDate, { utc: true })));
	test('Convert Current DateTime to UTC Date', () => expect(currentDateTime.utc().toDate()).toEqual(currentUtcDate));

	const pastDate = new Date(2011, 10, 5, 12, 45, 12, 901);
	const pastDateTime = new DateTime([2011, 11, 5, 12, 45, 12, 901]);

	test('Convert Past DateTime to UTC DateTime', () => expect(pastDateTime.utc()).toEqual(DateTime.utc(pastDate)));
	test('Convert Past DateTime to UTC Date', () => expect(pastDateTime.utc().toDate()).toEqual(pastDate));
});

let { date, dateTime } = _createDatesFromArray([2020, 6, 22, 12, 30, 45, 100]);

test('Add should return new instance', () => expect(dateTime.add(2, DateTime.Period.YEARS)).not.toBe(dateTime));

describe('Add years', () => {
	const addYearsDateTime = dateTime.add(1, DateTime.Period.YEARS);
	const addYearsDate = new Date(date.getTime());
	addYearsDate.setFullYear(date.getFullYear() + 1);

	it('Should have the same year as native Date', () => expect(addYearsDateTime.getYear()).toEqual(addYearsDate.getFullYear()));
	it('Should have the same value as native Date', () => expect(addYearsDateTime.valueOf()).toEqual(addYearsDate.valueOf()));
	it('Should be equal to new native Date object', () => expect(addYearsDateTime.toDate()).toEqual(addYearsDate));
	it('Should be equal to new DateTime object', () => expect(addYearsDateTime).toEqual(new DateTime(addYearsDate)));
});

describe('Add months', () => {
	const addMonthsDateTime = dateTime.add(1, DateTime.Period.MONTHS);
	const addMonthsDate = new Date(date.getTime());
	addMonthsDate.setMonth(date.getMonth() + 1);

	it('Should have the same month as native Date', () => expect(addMonthsDateTime.getMonth()).toEqual(addMonthsDate.getMonth() + 1));
	it('Should have the same value as native Date', () => expect(addMonthsDateTime.valueOf()).toEqual(addMonthsDate.valueOf()));
	it('Should be equal to new native Date object', () => expect(addMonthsDateTime.toDate()).toEqual(addMonthsDate));
	it('Should be equal to new DateTime object', () => expect(addMonthsDateTime).toEqual(new DateTime(addMonthsDate)));
});

describe('Add days', () => {
	const addDayDateTime = dateTime.add(1, DateTime.Period.DAYS);
	const addDayDate = new Date(date.getTime());
	addDayDate.setDate(date.getDate() + 1);

	it('Should have the same day of the month as native Date', () => expect(addDayDateTime.getDay()).toEqual(addDayDate.getDate()));
	it('Should have the same value as native Date', () => expect(addDayDateTime.valueOf()).toEqual(addDayDate.valueOf()));
	it('Should be equal to new native Date object', () => expect(addDayDateTime.toDate()).toEqual(addDayDate));
	it('Should be equal to new DateTime object', () => expect(addDayDateTime).toEqual(new DateTime(addDayDate)));
});

describe('Add hours', () => {
	const addHoursDateTime = dateTime.add(1, DateTime.Period.HOURS);
	const addHoursDate = new Date(date.getTime());
	addHoursDate.setHours(date.getHours() + 1);

	it('Should have the same hours as native Date', () => expect(addHoursDateTime.getHour()).toEqual(addHoursDate.getHours()));
	it('Should have the same value as native Date', () => expect(addHoursDateTime.valueOf()).toEqual(addHoursDate.valueOf()));
	it('Should be equal to new native Date object', () => expect(addHoursDateTime.toDate()).toEqual(addHoursDate));
	it('Should be equal to new DateTime object', () => expect(addHoursDateTime).toEqual(new DateTime(addHoursDate)));
});

describe('Add minutes', () => {
	const addMinutesDateTime = dateTime.add(1, DateTime.Period.MINUTES);
	const addMinutesDate = new Date(date.getTime());
	addMinutesDate.setMinutes(date.getMinutes() + 1);

	it('Should have the same minutes as native Date', () => expect(addMinutesDateTime.getMinute()).toEqual(addMinutesDate.getMinutes()));
	it('Should have the same value as native Date', () => expect(addMinutesDateTime.valueOf()).toEqual(addMinutesDate.valueOf()));
	it('Should be equal to new native Date object', () => expect(addMinutesDateTime.toDate()).toEqual(addMinutesDate));
	it('Should be equal to new DateTime object', () => expect(addMinutesDateTime).toEqual(new DateTime(addMinutesDate)));
});

describe('Add seconds', () => {
	const addHoursDateTime = dateTime.add(1, DateTime.Period.SECONDS);
	const addHoursDate = new Date(date.getTime());
	addHoursDate.setSeconds(date.getSeconds() + 1);

	it('Should have the same seconds as native Date', () => expect(addHoursDateTime.getSecond()).toEqual(addHoursDate.getSeconds()));
	it('Should have the same value as native Date', () => expect(addHoursDateTime.valueOf()).toEqual(addHoursDate.valueOf()));
	it('Should be equal to new native Date object', () => expect(addHoursDateTime.toDate()).toEqual(addHoursDate));
	it('Should be equal to new DateTime object', () => expect(addHoursDateTime).toEqual(new DateTime(addHoursDate)));
});

describe('Add milliseconds', () => {
	const addMillisecondsDateTime = dateTime.add(1, DateTime.Period.MILLISECONDS);
	const addMillisecondsDate = new Date(date.getTime());
	addMillisecondsDate.setMilliseconds(date.getMilliseconds() + 1);

	it('Should have the same milliseconds as native Date', () => expect(addMillisecondsDateTime.getMillisecond()).toEqual(addMillisecondsDate.getMilliseconds()));
	it('Should have the same value as native Date', () => expect(addMillisecondsDateTime.valueOf()).toEqual(addMillisecondsDate.valueOf()));
	it('Should be equal to new native Date object', () => expect(addMillisecondsDateTime.toDate()).toEqual(addMillisecondsDate));
	it('Should be equal to new DateTime object', () => expect(addMillisecondsDateTime).toEqual(new DateTime(addMillisecondsDate)));
});

({ date, dateTime } = _createDatesFromArray([2020, 6, 22, 12, 30, 45, 100]));

test('Subtract should return new instance', () => expect(dateTime.subtract(2, DateTime.Period.YEARS)).not.toBe(dateTime));

describe('Subtract years', () => {
	const subtractYearsDateTime = dateTime.subtract(1, DateTime.Period.YEARS);
	const subtractYearsDate = new Date(date.getTime());
	subtractYearsDate.setFullYear(date.getFullYear() - 1);

	it('Should have the same year as native Date', () => expect(subtractYearsDateTime.getYear()).toEqual(subtractYearsDate.getFullYear()));
	it('Should have the same value as native Date', () => expect(subtractYearsDateTime.valueOf()).toEqual(subtractYearsDate.valueOf()));
	it('Should be equal to new native Date object', () => expect(subtractYearsDateTime.toDate()).toEqual(subtractYearsDate));
	it('Should be equal to new DateTime object', () => expect(subtractYearsDateTime).toEqual(new DateTime(subtractYearsDate)));
});

describe('Subtract months', () => {
	const subtractMonthsDateTime = dateTime.subtract(1, DateTime.Period.MONTHS);
	const subtractMonthsDate = new Date(date.getTime());
	subtractMonthsDate.setMonth(date.getMonth() - 1);

	it('Should have the same month as native Date', () => expect(subtractMonthsDateTime.getMonth()).toEqual(subtractMonthsDate.getMonth() + 1));
	it('Should have the same value as native Date', () => expect(subtractMonthsDateTime.valueOf()).toEqual(subtractMonthsDate.valueOf()));
	it('Should be equal to new native Date object', () => expect(subtractMonthsDateTime.toDate()).toEqual(subtractMonthsDate));
	it('Should be equal to new DateTime object', () => expect(subtractMonthsDateTime).toEqual(new DateTime(subtractMonthsDate)));
});

describe('Subtract days', () => {
	const subtractDayDateTime = dateTime.subtract(1, DateTime.Period.DAYS);
	const subtractDayDate = new Date(date.getTime());
	subtractDayDate.setDate(date.getDate() - 1);

	it('Should have the same day of the month as native Date', () => expect(subtractDayDateTime.getDay()).toEqual(subtractDayDate.getDate()));
	it('Should have the same value as native Date', () => expect(subtractDayDateTime.valueOf()).toEqual(subtractDayDate.valueOf()));
	it('Should be equal to new native Date object', () => expect(subtractDayDateTime.toDate()).toEqual(subtractDayDate));
	it('Should be equal to new DateTime object', () => expect(subtractDayDateTime).toEqual(new DateTime(subtractDayDate)));
});

describe('Subtract hours', () => {
	const subtractHoursDateTime = dateTime.subtract(1, DateTime.Period.HOURS);
	const subtractHoursDate = new Date(date.getTime());
	subtractHoursDate.setHours(date.getHours() - 1);

	it('Should have the same hours as native Date', () => expect(subtractHoursDateTime.getHour()).toEqual(subtractHoursDate.getHours()));
	it('Should have the same value as native Date', () => expect(subtractHoursDateTime.valueOf()).toEqual(subtractHoursDate.valueOf()));
	it('Should be equal to new native Date object', () => expect(subtractHoursDateTime.toDate()).toEqual(subtractHoursDate));
	it('Should be equal to new DateTime object', () => expect(subtractHoursDateTime).toEqual(new DateTime(subtractHoursDate)));
});

describe('Subtract minutes', () => {
	const subtractMinutesDateTime = dateTime.subtract(1, DateTime.Period.MINUTES);
	const subtractMinutesDate = new Date(date.getTime());
	subtractMinutesDate.setMinutes(date.getMinutes() - 1);

	it('Should have the same minutes as native Date', () => expect(subtractMinutesDateTime.getMinute()).toEqual(subtractMinutesDate.getMinutes()));
	it('Should have the same value as native Date', () => expect(subtractMinutesDateTime.valueOf()).toEqual(subtractMinutesDate.valueOf()));
	it('Should be equal to new native Date object', () => expect(subtractMinutesDateTime.toDate()).toEqual(subtractMinutesDate));
	it('Should be equal to new DateTime object', () => expect(subtractMinutesDateTime).toEqual(new DateTime(subtractMinutesDate)));
});

describe('Subtract seconds', () => {
	const subtractHoursDateTime = dateTime.subtract(1, DateTime.Period.SECONDS);
	const subtractHoursDate = new Date(date.getTime());
	subtractHoursDate.setSeconds(date.getSeconds() - 1);

	it('Should have the same seconds as native Date', () => expect(subtractHoursDateTime.getSecond()).toEqual(subtractHoursDate.getSeconds()));
	it('Should have the same value as native Date', () => expect(subtractHoursDateTime.valueOf()).toEqual(subtractHoursDate.valueOf()));
	it('Should be equal to new native Date object', () => expect(subtractHoursDateTime.toDate()).toEqual(subtractHoursDate));
	it('Should be equal to new DateTime object', () => expect(subtractHoursDateTime).toEqual(new DateTime(subtractHoursDate)));
});

describe('Subtract milliseconds', () => {
	const subtractMillisecondsDateTime = dateTime.subtract(1, DateTime.Period.MILLISECONDS);
	const subtractMillisecondsDate = new Date(date.getTime());
	subtractMillisecondsDate.setMilliseconds(date.getMilliseconds() - 1);

	it('Should have the same milliseconds as native Date', () => expect(subtractMillisecondsDateTime.getMillisecond()).toEqual(subtractMillisecondsDate.getMilliseconds()));
	it('Should have the same value as native Date', () => expect(subtractMillisecondsDateTime.valueOf()).toEqual(subtractMillisecondsDate.valueOf()));
	it('Should be equal to new native Date object', () => expect(subtractMillisecondsDateTime.toDate()).toEqual(subtractMillisecondsDate));
	it('Should be equal to new DateTime object', () => expect(subtractMillisecondsDateTime).toEqual(new DateTime(subtractMillisecondsDate)));
});

describe('valueOf', () => {
	const date = new Date();
	const dateTime = new DateTime();
	const { date: pastDate, dateTime: pastDateTime } = _createDatesFromArray([1986, 10, 14, 15, 33, 18, 451]);
	const { date: ancientDate, dateTime: ancientDateTime } = _createDatesFromArray([1, 1, 1, 14, 22, 48, 223]);

	test('Current DateTime and Date objects have the same value', () => expect(dateTime.valueOf()).toEqual(date.valueOf()));
	test('Current DateTime and Date objects have the same value', () => expect(pastDateTime.valueOf()).toEqual(pastDate.valueOf()));
	test('Ancient DateTime and Date objects have the same value', () => expect(ancientDateTime.valueOf()).toEqual(ancientDate.valueOf()));
});