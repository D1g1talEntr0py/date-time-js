import MockDate from 'mockdate';
import { beforeEach, afterEach, expect, describe, it, test } from '@jest/globals';
import { _get } from '../src/js/constants.js';
import DateTime from '../src/js/date-time.js';
import { Type, Types } from '../src/js/types.js';
import { _createCurrentUtcDate } from './test.utilities.js';

beforeEach(() => MockDate.set(new Date()));

afterEach(() => MockDate.reset());

const checkDateProperties = (type, dateTime, date) => {
  it('Should be valid', () => expect(dateTime.toDate().toString()).not.toBe('Invalid Date'));
  it('Should have same year as native Date', () => expect(dateTime.getYear()).toBe(_get(date, 'FullYear', dateTime.isUtc())));
  // Native JavaScript Date uses 0-based months. ლ(ಠ益ಠლ)
  it('Should have same month as native Date', () => expect(dateTime.getMonth()).toBe(_get(date, 'Month', dateTime.isUtc()) + 1));
  it('Should have same day as native Date', () => expect(dateTime.getDay()).toBe(_get(date, 'Date', dateTime.isUtc())));
  it('Should have same hours as native Date', () => expect(dateTime.getHours()).toBe(_get(date, 'Hours', dateTime.isUtc())));
  it('Should have same minutes as native Date', () => expect(dateTime.getMinutes()).toBe(_get(date, 'Minutes', dateTime.isUtc())));
  it('Should have same seconds as native Date', () => expect(dateTime.getSeconds()).toBe(_get(date, 'Seconds', dateTime.isUtc())));
  // Because the 2 Date objects were instantiated separately using the default constructor,
  // 'dateTime' could have milliseconds that are equal or greater than 'date'
  it('Should have milliseconds less than or equal to native Date', () => expect(dateTime.getMilliseconds()).toBeLessThanOrEqual(_get(date, 'Milliseconds', dateTime.isUtc())));
};

test('Invalid Date', () => expect(new DateTime('date').toDate().toString()).toBe('Invalid Date'));

describe('Modern Dates', () => {
  const currentDate = new Date();
  const pastDate = new Date(1986, 9, 14, 22, 5, 18, 334);

  describe.each([
    ['default', new DateTime(), new Date()],
    ['Date', new DateTime(currentDate), currentDate],
    ['Number', new DateTime(currentDate.getTime()), new Date(currentDate.getTime())],
    ['String', new DateTime('1986-10-14T22:05:18.334'), pastDate],
    ['Array', new DateTime([1986, 10, 14, 22, 5, 18, 334]), pastDate],
    ['null', new DateTime(null), new Date()],
    ['undefined', new DateTime(undefined), new Date()]
  ])('Check DateTime properties using "%s" constructor', checkDateProperties);

  const pastUtcDate = new Date(Date.UTC(1986, 9, 14, 22, 5, 18, 334));

  describe.each([
    ['Date', new DateTime(new Date(), { utc: true }), _createCurrentUtcDate()],
    ['Number', new DateTime(Date.now(), { utc: true }), _createCurrentUtcDate()],
    ['String', new DateTime('1986-10-14T22:05:18.334', { utc: true }), pastUtcDate],
    ['Array', new DateTime([1986, 10, 14, 22, 5, 18, 334], { utc: true }), pastUtcDate],
    ['null', new DateTime(null, { utc: true }), _createCurrentUtcDate()],
    ['undefined', new DateTime(undefined, { utc: true }), _createCurrentUtcDate()]
  ])('Check DateTime properties using "%s" constructor with the UTC parameter option', checkDateProperties);

  describe.each([
    ['parse', DateTime.parse('19861014 10:8:2', 'YYYYMMDD hh:m:s'), new Date(1986, 9, 14, 10, 8, 2)],
    ['utc', DateTime.utc('19861014 10:8:2', 'YYYYMMDD hh:m:s'), new Date(Date.UTC(1986, 9, 14, 10, 8, 2))],
    ['orNull', DateTime.orNull('1986-10-14T10:08:02'), new Date(1986, 9, 14, 10, 8, 2)],
    ['startOf', DateTime.startOf(DateTime.units.YEAR), new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0)]
  ])('Check properties using static %s method', checkDateProperties);
});

describe('Ancient Dates', () => {
  const dateValues = [1, 0, 1, 0, 0, 0, 0];
  const date = new Date(...dateValues);
  date.setFullYear(1);

  describe.each([
    ['Date', new DateTime(date), date],
    ['Number', new DateTime(date.getTime()), new Date(date.getTime())],
    ['String', new DateTime('0001-01-01T00:00:00.000'), date],
    ['Array', new DateTime([1, 1, 1, 0, 0, 0, 0]), date]
  ])('Check DateTime properties using "%s" constructor', checkDateProperties);

  const utcDate = new Date(Date.UTC(...dateValues));
  utcDate.setUTCFullYear(1);

  describe.each([
    ['Date', new DateTime(date, { utc: true }), utcDate],
    ['Number', new DateTime(+date, { utc: true }), utcDate],
    ['String', new DateTime('0001-01-01T00:00:00.000Z'), utcDate],
    ['Array', new DateTime([1, 1, 1, 0, 0, 0, 0], { utc: true }), utcDate]
  ])('Check DateTime properties using "%s" constructor with the UTC parameter option', checkDateProperties);

  describe.each([
    ['parse', DateTime.parse('00010101 00:0:0.0', 'YYYYMMDD hh:m:s.S'), date],
    ['utc', DateTime.utc('00010101 00:0:0.0', 'YYYYMMDD hh:m:s.S'), utcDate],
    ['orNull', DateTime.orNull('0001-01-01T00:00:00.0'), date]
  ])('Check properties using static %s method', checkDateProperties);
});

describe('Type checks', () => {
  const dateTime = new DateTime();

  test('Instance Of', () => expect(dateTime).toBeInstanceOf(DateTime));
  test('Instance Of', () => expect(dateTime).not.toBeInstanceOf(Date));
  test('Type Of', () => expect(typeof(dateTime) == 'object').toBe(true));
  test('Is DateTime', () => expect(Type.isDateTime(dateTime)).toBe(true));
  test('DATE_TIME static member', () => expect(Types.DATE_TIME == 'DateTime').toBe(true));
});

describe('Start of', () => {
	let currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();
	const currentDay = currentDate.getDate();
	const currentHour = currentDate.getHours();
	const currentMinute = currentDate.getMinutes();
	const currentSecond = currentDate.getSeconds();

  const startOfYearDateTime = DateTime.startOf(DateTime.units.YEAR);
  const startOfYearDate = new Date(currentYear, 0, 1, 0, 0, 0, 0);
	test('Start of Year', () => expect(startOfYearDateTime).toEqual(new DateTime(startOfYearDate)));

  const startOfMonthDateTime = DateTime.startOf(DateTime.units.MONTH);
  const startOfMonthDate = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
	test('Start of Month', () => expect(startOfMonthDateTime).toEqual(new DateTime(startOfMonthDate)));

  const startOfDayDateTime = DateTime.startOf(DateTime.units.DAY);
  const startOfDayDate = new Date(currentYear, currentMonth, currentDay, 0, 0, 0, 0);
	test('Start of Day', () => expect(startOfDayDateTime).toEqual(new DateTime(startOfDayDate)));

  const startOfHourDateTime = DateTime.startOf(DateTime.units.HOUR);
  const startOfHourDate = new Date(currentYear, currentMonth, currentDay, currentHour, 0, 0, 0);
	test('Start of Hour', () => expect(startOfHourDateTime).toEqual(new DateTime(startOfHourDate)));

  const startOfMinuteDateTime = DateTime.startOf(DateTime.units.MINUTE);
  const startOfMinuteDate = new Date(currentYear, currentMonth, currentDay, currentHour, currentMinute, 0, 0);
	test('Start of Minute', () => expect(startOfMinuteDateTime).toEqual(new DateTime(startOfMinuteDate)));

  const startOfSecondDateTime = DateTime.startOf(DateTime.units.SECOND);
  const startOfSecondDate = new Date(currentYear, currentMonth, currentDay, currentHour, currentMinute, currentSecond, 0);
	test('Start of Second', () => expect(startOfSecondDateTime).toEqual(new DateTime(startOfSecondDate)));

  describe.each([
    ['Start of Year', startOfYearDateTime, startOfYearDate],
    ['Start of Month', startOfMonthDateTime, startOfMonthDate],
    ['start of Day', startOfDayDateTime, startOfDayDate],
    ['Start of Hour', startOfHourDateTime, startOfHourDate],
    ['Start of Minute', startOfMinuteDateTime, startOfMinuteDate],
    ['Start of Second', startOfSecondDateTime, startOfSecondDate]
  ])('Check %s DateTime created with "startOf" static method', checkDateProperties);
});