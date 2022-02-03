import MockDate from 'mockdate';
import DateTime from '../src/js/date-time.js';
import { _createDateFromArray, _createDatesFromArray } from './test.utilities.js';
import { beforeEach, afterEach, expect, describe, it, test } from '@jest/globals';

beforeEach(() => MockDate.set(new Date()));

afterEach(() => MockDate.reset());

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

	test('Start of returns new instance of DateTime object ensuring immutability', () => expect(dateTime.startOf(DateTime.units.YEAR)).not.toBe(dateTime));
	test('Start of Year', () => expect(dateTime.startOf(DateTime.units.YEAR)).toEqual(DateTime.utc([year, 1, 1, 0, 0, 0, 0])));
	test('Start of Month', () => expect(dateTime.startOf(DateTime.units.MONTH)).toEqual(DateTime.utc([year, month, 1, 0, 0, 0, 0])));
	test('Start of Day', () => expect(dateTime.startOf(DateTime.units.DAY)).toEqual(DateTime.utc([year, month, day, 0, 0, 0, 0])));
	test('Start of Hour', () => expect(dateTime.startOf(DateTime.units.HOUR)).toEqual(DateTime.utc([year, month, day, hour, 0, 0, 0])));
	test('Start of Minute', () => expect(dateTime.startOf(DateTime.units.MINUTE)).toEqual(DateTime.utc([year, month, day, hour, minute, 0, 0])));
	test('Start of Second', () => expect(dateTime.startOf(DateTime.units.SECOND)).toEqual(DateTime.utc([year, month, day, hour, minute, second, 0])));
});

describe('local', () => {
	const currentDate = new Date();
	const currentDateTime = DateTime.utc(currentDate);

	test('Method returns new instance of DateTime object ensuring immutability', () => expect(currentDateTime.local()).not.toBe(currentDateTime));
	test('Convert Current UTC DateTime to Local DateTime', () => expect(currentDateTime.local()).toEqual(new DateTime(currentDate)));
	test('Convert Current UTC DateTime to Date', () => expect(currentDateTime.local().toDate()).toEqual(currentDate));

	const pastDateParts = [2011, 11, 5, 12, 45, 12, 901];
	const pastUtcDateTime = DateTime.utc(pastDateParts);

	test('Convert Past UTC DateTime to Local DateTime', () => expect(pastUtcDateTime.local()).toEqual(new DateTime(pastDateParts)));
	test('Convert Past UTC DateTime to Date', () => expect(pastUtcDateTime.local().toDate()).toEqual(_createDateFromArray(pastDateParts)));
});

describe('utc', () => {
	const currentDate = new Date();
	const currentDateTime = new DateTime(currentDate);

	test('Method returns new instance of DateTime object ensuring immutability', () => expect(currentDateTime.utc()).not.toBe(currentDateTime));
	test('Convert Current DateTime to UTC DateTime', () => expect(currentDateTime.utc()).toEqual(DateTime.utc(currentDate)));
	test('Convert Current DateTime to UTC Date', () => expect(currentDateTime.utc().toDate()).toEqual(new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()))));

	const pastDateParts = [2011, 11, 5, 12, 45, 12, 901];
	const pastDateTime = new DateTime(pastDateParts);

	test('Convert Past DateTime to UTC DateTime', () => expect(pastDateTime.utc()).toEqual(DateTime.utc(pastDateParts)));
	test('Convert Past DateTime to UTC Date', () => expect(pastDateTime.utc().toDate()).toEqual(_createDateFromArray(pastDateParts, true)));
});

describe('add', () => {
	const { date, dateTime } = _createDatesFromArray([2020, 6, 22, 12, 30, 45, 100]);

	test('Add should return new instance', () => expect(dateTime.add(2, DateTime.periods.YEARS)).not.toBe(dateTime));

	describe('Add years', () => {
		const addYearsDateTime = dateTime.add(1, DateTime.periods.YEARS);
		const addYearsDate = new Date(date.getTime());
		addYearsDate.setFullYear(date.getFullYear() + 1);

		it('Should have the same year as native Date', () => expect(addYearsDateTime.getYear()).toEqual(addYearsDate.getFullYear()));
		it('Should have the same value as native Date', () => expect(addYearsDateTime.valueOf()).toEqual(addYearsDate.valueOf()));
		it('Should be equal to new native Date object', () => expect(addYearsDateTime.toDate()).toEqual(addYearsDate));
		it('Should be equal to new DateTime object', () => expect(addYearsDateTime).toEqual(new DateTime(addYearsDate)));
	});

	describe('Add months', () => {
		const addMonthsDateTime = dateTime.add(1, DateTime.periods.MONTHS);
		const addMonthsDate = new Date(date.getTime());
		addMonthsDate.setMonth(date.getMonth() + 1);

		it('Should have the same month as native Date', () => expect(addMonthsDateTime.getMonth()).toEqual(addMonthsDate.getMonth() + 1));
		it('Should have the same value as native Date', () => expect(addMonthsDateTime.valueOf()).toEqual(addMonthsDate.valueOf()));
		it('Should be equal to new native Date object', () => expect(addMonthsDateTime.toDate()).toEqual(addMonthsDate));
		it('Should be equal to new DateTime object', () => expect(addMonthsDateTime).toEqual(new DateTime(addMonthsDate)));
	});

	describe('Add days', () => {
		const addDayDateTime = dateTime.add(1, DateTime.periods.DAYS);
		const addDayDate = new Date(date.getTime());
		addDayDate.setDate(date.getDate() + 1);

		it('Should have the same day of the month as native Date', () => expect(addDayDateTime.getDay()).toEqual(addDayDate.getDate()));
		it('Should have the same value as native Date', () => expect(addDayDateTime.valueOf()).toEqual(addDayDate.valueOf()));
		it('Should be equal to new native Date object', () => expect(addDayDateTime.toDate()).toEqual(addDayDate));
		it('Should be equal to new DateTime object', () => expect(addDayDateTime).toEqual(new DateTime(addDayDate)));
	});

	describe('Add hours', () => {
		const addHoursDateTime = dateTime.add(1, DateTime.periods.HOURS);
		const addHoursDate = new Date(date.getTime());
		addHoursDate.setHours(date.getHours() + 1);

		it('Should have the same hours as native Date', () => expect(addHoursDateTime.getHours()).toEqual(addHoursDate.getHours()));
		it('Should have the same value as native Date', () => expect(addHoursDateTime.valueOf()).toEqual(addHoursDate.valueOf()));
		it('Should be equal to new native Date object', () => expect(addHoursDateTime.toDate()).toEqual(addHoursDate));
		it('Should be equal to new DateTime object', () => expect(addHoursDateTime).toEqual(new DateTime(addHoursDate)));
	});

	describe('Add minutes', () => {
		const addMinutesDateTime = dateTime.add(1, DateTime.periods.MINUTES);
		const addMinutesDate = new Date(date.getTime());
		addMinutesDate.setMinutes(date.getMinutes() + 1);

		it('Should have the same minutes as native Date', () => expect(addMinutesDateTime.getMinutes()).toEqual(addMinutesDate.getMinutes()));
		it('Should have the same value as native Date', () => expect(addMinutesDateTime.valueOf()).toEqual(addMinutesDate.valueOf()));
		it('Should be equal to new native Date object', () => expect(addMinutesDateTime.toDate()).toEqual(addMinutesDate));
		it('Should be equal to new DateTime object', () => expect(addMinutesDateTime).toEqual(new DateTime(addMinutesDate)));
	});

	describe('Add seconds', () => {
		const addHoursDateTime = dateTime.add(1, DateTime.periods.SECONDS);
		const addHoursDate = new Date(date.getTime());
		addHoursDate.setSeconds(date.getSeconds() + 1);

		it('Should have the same seconds as native Date', () => expect(addHoursDateTime.getSeconds()).toEqual(addHoursDate.getSeconds()));
		it('Should have the same value as native Date', () => expect(addHoursDateTime.valueOf()).toEqual(addHoursDate.valueOf()));
		it('Should be equal to new native Date object', () => expect(addHoursDateTime.toDate()).toEqual(addHoursDate));
		it('Should be equal to new DateTime object', () => expect(addHoursDateTime).toEqual(new DateTime(addHoursDate)));
	});

	describe('Add milliseconds', () => {
		const addMillisecondsDateTime = dateTime.add(1, DateTime.periods.MILLISECONDS);
		const addMillisecondsDate = new Date(date.getTime());
		addMillisecondsDate.setMilliseconds(date.getMilliseconds() + 1);

		it('Should have the same milliseconds as native Date', () => expect(addMillisecondsDateTime.getMilliseconds()).toEqual(addMillisecondsDate.getMilliseconds()));
		it('Should have the same value as native Date', () => expect(addMillisecondsDateTime.valueOf()).toEqual(addMillisecondsDate.valueOf()));
		it('Should be equal to new native Date object', () => expect(addMillisecondsDateTime.toDate()).toEqual(addMillisecondsDate));
		it('Should be equal to new DateTime object', () => expect(addMillisecondsDateTime).toEqual(new DateTime(addMillisecondsDate)));
	});
});

describe('subtract', () => {
	const { date, dateTime } = _createDatesFromArray([2020, 6, 22, 12, 30, 45, 100]);

	test('Subtract should return new instance', () => expect(dateTime.subtract(2, DateTime.periods.YEARS)).not.toBe(dateTime));

	describe('Subtract years', () => {
		const addYearsDateTime = dateTime.subtract(1, DateTime.periods.YEARS);
		const addYearsDate = new Date(date.getTime());
		addYearsDate.setFullYear(date.getFullYear() - 1);

		it('Should have the same year as native Date', () => expect(addYearsDateTime.getYear()).toEqual(addYearsDate.getFullYear()));
		it('Should have the same value as native Date', () => expect(addYearsDateTime.valueOf()).toEqual(addYearsDate.valueOf()));
		it('Should be equal to new native Date object', () => expect(addYearsDateTime.toDate()).toEqual(addYearsDate));
		it('Should be equal to new DateTime object', () => expect(addYearsDateTime).toEqual(new DateTime(addYearsDate)));
	});

	describe('Subtract months', () => {
		const addMonthsDateTime = dateTime.subtract(1, DateTime.periods.MONTHS);
		const addMonthsDate = new Date(date.getTime());
		addMonthsDate.setMonth(date.getMonth() - 1);

		it('Should have the same month as native Date', () => expect(addMonthsDateTime.getMonth()).toEqual(addMonthsDate.getMonth() + 1));
		it('Should have the same value as native Date', () => expect(addMonthsDateTime.valueOf()).toEqual(addMonthsDate.valueOf()));
		it('Should be equal to new native Date object', () => expect(addMonthsDateTime.toDate()).toEqual(addMonthsDate));
		it('Should be equal to new DateTime object', () => expect(addMonthsDateTime).toEqual(new DateTime(addMonthsDate)));
	});

	describe('Subtract days', () => {
		const addDayDateTime = dateTime.subtract(1, DateTime.periods.DAYS);
		const addDayDate = new Date(date.getTime());
		addDayDate.setDate(date.getDate() - 1);

		it('Should have the same day of the month as native Date', () => expect(addDayDateTime.getDay()).toEqual(addDayDate.getDate()));
		it('Should have the same value as native Date', () => expect(addDayDateTime.valueOf()).toEqual(addDayDate.valueOf()));
		it('Should be equal to new native Date object', () => expect(addDayDateTime.toDate()).toEqual(addDayDate));
		it('Should be equal to new DateTime object', () => expect(addDayDateTime).toEqual(new DateTime(addDayDate)));
	});

	describe('Subtract hours', () => {
		const addHoursDateTime = dateTime.subtract(1, DateTime.periods.HOURS);
		const addHoursDate = new Date(date.getTime());
		addHoursDate.setHours(date.getHours() - 1);

		it('Should have the same hours as native Date', () => expect(addHoursDateTime.getHours()).toEqual(addHoursDate.getHours()));
		it('Should have the same value as native Date', () => expect(addHoursDateTime.valueOf()).toEqual(addHoursDate.valueOf()));
		it('Should be equal to new native Date object', () => expect(addHoursDateTime.toDate()).toEqual(addHoursDate));
		it('Should be equal to new DateTime object', () => expect(addHoursDateTime).toEqual(new DateTime(addHoursDate)));
	});

	describe('Subtract minutes', () => {
		const addMinutesDateTime = dateTime.subtract(1, DateTime.periods.MINUTES);
		const addMinutesDate = new Date(date.getTime());
		addMinutesDate.setMinutes(date.getMinutes() - 1);

		it('Should have the same minutes as native Date', () => expect(addMinutesDateTime.getMinutes()).toEqual(addMinutesDate.getMinutes()));
		it('Should have the same value as native Date', () => expect(addMinutesDateTime.valueOf()).toEqual(addMinutesDate.valueOf()));
		it('Should be equal to new native Date object', () => expect(addMinutesDateTime.toDate()).toEqual(addMinutesDate));
		it('Should be equal to new DateTime object', () => expect(addMinutesDateTime).toEqual(new DateTime(addMinutesDate)));
	});

	describe('Subtract seconds', () => {
		const addHoursDateTime = dateTime.subtract(1, DateTime.periods.SECONDS);
		const addHoursDate = new Date(date.getTime());
		addHoursDate.setSeconds(date.getSeconds() - 1);

		it('Should have the same seconds as native Date', () => expect(addHoursDateTime.getSeconds()).toEqual(addHoursDate.getSeconds()));
		it('Should have the same value as native Date', () => expect(addHoursDateTime.valueOf()).toEqual(addHoursDate.valueOf()));
		it('Should be equal to new native Date object', () => expect(addHoursDateTime.toDate()).toEqual(addHoursDate));
		it('Should be equal to new DateTime object', () => expect(addHoursDateTime).toEqual(new DateTime(addHoursDate)));
	});

	describe('Subtract milliseconds', () => {
		const addMillisecondsDateTime = dateTime.subtract(1, DateTime.periods.MILLISECONDS);
		const addMillisecondsDate = new Date(date.getTime());
		addMillisecondsDate.setMilliseconds(date.getMilliseconds() - 1);

		it('Should have the same milliseconds as native Date', () => expect(addMillisecondsDateTime.getMilliseconds()).toEqual(addMillisecondsDate.getMilliseconds()));
		it('Should have the same value as native Date', () => expect(addMillisecondsDateTime.valueOf()).toEqual(addMillisecondsDate.valueOf()));
		it('Should be equal to new native Date object', () => expect(addMillisecondsDateTime.toDate()).toEqual(addMillisecondsDate));
		it('Should be equal to new DateTime object', () => expect(addMillisecondsDateTime).toEqual(new DateTime(addMillisecondsDate)));
	});
});

describe('valueOf', () => {
	const date = new Date();
	const dateTime = new DateTime();
	const { date: pastDate, dateTime: pastDateTime } = _createDatesFromArray([1986, 10, 14, 15, 33, 18, 451]);
	const { date: ancientDate, dateTime: ancientDateTime } = _createDatesFromArray([1, 1, 1, 14, 22, 48, 223]);

	test('Current DateTime and Date objects have the same value', () => expect(dateTime.valueOf()).toBeGreaterThanOrEqual(date.valueOf()));
	test('Current DateTime and Date objects have the same value', () => expect(pastDateTime.valueOf()).toEqual(pastDate.valueOf()));
	test('Ancient DateTime and Date objects have the same value', () => expect(ancientDateTime.valueOf()).toEqual(ancientDate.valueOf()));
});