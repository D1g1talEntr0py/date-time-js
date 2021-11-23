import MockDate from 'mockdate';
import { beforeEach, afterEach, expect, describe, it, test } from '@jest/globals';
import { _get } from '../src/js/constants.js';
import DateTime from '../src/js/date-time.js';

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

describe.each([
  ['default', new DateTime(), new Date()],
  ['date', new DateTime(new Date()), new Date()],
  ['Number', new DateTime(Date.now()), new Date(Date.now())],
  ['String', new DateTime('1986-10-14T22:05:18.334'), new Date(1986, 9, 14, 22, 5, 18, 334)],
  ['Array', new DateTime([1986, 10, 14, 22, 5, 18, 334]), new Date(1986, 9, 14, 22, 5, 18, 334)],
  ['null', new DateTime(null), new Date()],
  ['undefined', new DateTime(undefined), new Date()],
  ['DateTime', new DateTime(new DateTime(new Date())), new Date()]
])('Check DateTime properties using "%s" constructor', checkDateProperties);

describe.each([
  ['date', new DateTime(new Date(), { utc: true }), new Date()],
  ['Number', new DateTime(Date.now(), { utc: true }), new Date(Date.now())],
  ['String', new DateTime('1986-10-14T22:05:18.334', { utc: true }), new Date(Date.UTC(1986, 9, 14, 22, 5, 18, 334))],
  ['Array', new DateTime([1986, 10, 14, 22, 5, 18, 334], { utc: true }), new Date(Date.UTC(1986, 9, 14, 22, 5, 18, 334))],
  ['null', new DateTime(null, { utc: true }), new Date()],
  ['undefined', new DateTime(undefined, { utc: true }), new Date()],
  ['boolean', new DateTime(true), new Date()],
  ['DateTime', new DateTime(new Date(), { utc: true }), new Date()]
])('Check DateTime properties using "%s" constructor with the UTC parameter option', checkDateProperties);

describe.each([
  ['parse', DateTime.parse('19861014 10:8:2', 'YYYYMMDD hh:m:s'), new Date(1986, 9, 14, 10, 8, 2)],
  ['utc', DateTime.utc('19861014 10:8:2', 'YYYYMMDD hh:m:s'), new Date(Date.UTC(1986, 9, 14, 10, 8, 2))],
  ['orNull', DateTime.orNull('1986-10-14T10:08:02'), new Date(1986, 9, 14, 10, 8, 2)]
])('Check properties using static %s method', checkDateProperties);

describe('Array Constructor', () => {
   // 2021-04-02T03:04:05.010
  const dateTime = new DateTime([2011, 3, 2, 3, 4, 5, 10]);

  test('year is later', () => expect(dateTime.equals(new DateTime([2012, 3, 2, 3, 5, 5, 10]))).toBe(false));
  test('year is earlier', () => expect(dateTime.equals(new DateTime([2010, 3, 2, 3, 3, 5, 10]))).toBe(false));
  test('month is later', () => expect(dateTime.equals(new DateTime([2011, 4, 2, 3, 4, 5, 10]))).toBe(false));
  test('month is earlier', () => expect(dateTime.equals(new DateTime([2011, 2, 2, 3, 4, 5, 10]))).toBe(false));
  test('day is later', () => expect(dateTime.equals(new DateTime([2011, 3, 3, 3, 4, 5, 10]))).toBe(false));
  test('day is earlier', () => expect(dateTime.equals(new DateTime([2011, 3, 1, 3, 4, 5, 10]))).toBe(false));
  test('hour is later', () => expect(dateTime.equals(new DateTime([2011, 3, 2, 4, 4, 5, 10]))).toBe(false));
  test('hour is earlier', () => expect(dateTime.equals(new DateTime([2011, 3, 2, 2, 4, 5, 10]))).toBe(false));
  test('minute is later', () => expect(dateTime.equals(new DateTime([2011, 3, 2, 3, 5, 5, 10]))).toBe(false));
  test('minute is earlier', () => expect(dateTime.equals(new DateTime([2011, 3, 2, 3, 3, 5, 10]))).toBe(false));
  test('second is later', () => expect(dateTime.equals(new DateTime([2011, 3, 2, 3, 4, 6, 10]))).toBe(false));
  test('second is earlier', () => expect(dateTime.equals(new DateTime([2011, 3, 2, 3, 4, 4, 11]))).toBe(false));
  test('millisecond match', () => expect(dateTime.equals(new DateTime([2011, 3, 2, 3, 4, 5, 10]))).toBe(true));
  test('millisecond is later', () => expect(dateTime.equals(new DateTime([2011, 3, 2, 3, 4, 5, 11]))).toBe(false));
  test('millisecond is earlier', () => expect(dateTime.equals(new DateTime([2011, 3, 2, 3, 4, 5, 9]))).toBe(false));
  test('DateTimes are the same as themselves', () => expect(dateTime.equals(dateTime)).toBe(true));
  test('valueOf copied object should be equal', () => expect(dateTime.valueOf()).toBe(new DateTime(+dateTime).valueOf()));
});