// @ts-nocheck
import MockDate from 'mockdate';
import { beforeEach, afterEach, describe, it, expect } from '@jest/globals';
import DateTime from '../src/js/date-time.js';

beforeEach(() => MockDate.set(new Date()));

afterEach(() => MockDate.reset());

describe('Parse Local ISO Dates and Times', () => {
	it('Ancient Date', () => {
		const date = '0001-01-01';
		const dateTime = new DateTime(date);
		const firstDate = new Date(18000000);
		firstDate.setFullYear(1);

		expect(dateTime.isValid()).toBe(true);
		expect(dateTime.valueOf()).toBe(firstDate.valueOf());
		expect(dateTime.isDaylightSavingsTime()).toBe(false);
		expect(dateTime.setMonth(6).isDaylightSavingsTime()).toBe(false);
		expect(dateTime.isUtc()).toBe(false);
		expect(dateTime.format(DateTime.patterns.ISO_DATE)).toBe(date);
		expect(dateTime.isLeapYear()).toBe(false);
	});

  it('Now', () => expect(new DateTime().valueOf()).toBe(new Date().valueOf()));

  it('parse and format dates', () => {
    let d = '20130108';
    expect(DateTime.parse(d, 'YYYYMMDD').valueOf()).toBe(new Date(2013, 0, 8).valueOf());
    d = '2018-04-24';
    expect(new DateTime(d).valueOf()).toBe(new Date(2018, 3, 24).valueOf());
    d = '2018-04-24 11:12';
    expect(new DateTime(d).format()).toBe(new DateTime(new Date(2018, 3, 24, 11, 12)).format()); // not recommend
    d = '2018-05-02 11:12:13';
    expect(new DateTime(d).valueOf()).toBe(new Date(2018, 4, 2, 11, 12, 13).valueOf());
    d = '2018-05-02 11:12:13.998';
    expect(new DateTime(d).valueOf()).toBe(new Date(2018, 4, 2, 11, 12, 13, 998).valueOf());
    d = '2018-4-1';
    expect(DateTime.parse(d, 'YYYY-M-D').valueOf()).toBe(new Date(2018, 3, 1).valueOf()); // not recommend
    d = '2018-4-1 11:12';
    expect(DateTime.parse(d, 'YYYY-M-D hh:mm').format()).toBe(new DateTime(new Date(2018, 3, 1, 11, 12)).format()); // not recommend
    d = '2018-4-1 1:1:1:223';
    expect(DateTime.parse(d, 'YYYY-M-D h:m:s:SSS').valueOf()).toBe(new Date(2018, 3, 1, 1, 1, 1, 223).valueOf()); // not recommend
    d = '2018-01';
    expect(DateTime.parse(d, 'YYYY-MM').valueOf()).toBe(new Date(2018, 0).valueOf()); // not recommend
    d = '2018';
    expect(DateTime.parse(d, 'YYYY').format()).toBe(new DateTime(new Date(2018, 0)).format()); // not recommend
    d = '2018-05-02T11:12:13Z';
    expect(new DateTime(d).valueOf()).toBe(new Date(d).valueOf()); // not recommend
  });

  it('String ISO 8601 date, time and zone', () => {
    const time = '2018-04-04T16:00:00.000Z'
    expect(new DateTime(time).valueOf()).toBe(new Date(time).valueOf())
  });

	it('Arrays with time part', () => {
		const dateValues = [2018, 5, 1, 13, 52, 44];
		expect(new DateTime(dateValues).isValid()).toBe(true);
		expect(new DateTime(dateValues).valueOf()).toBe(new Date(...dateValues).valueOf());
	});

  it('rejects invalid values', () => {
    expect(new DateTime({}).isValid()).toBe(false);
    expect(new DateTime(() => '2018-01-01').isValid()).toBe(false);
    expect(new DateTime(Infinity).isValid()).toBe(false);
    expect(new DateTime(NaN).isValid()).toBe(false);
  });

  it('parses Arrays with date part', () => {
    const dateParts = [2018, 5, 1];
    const expected = '2018-05-01T00:00:00.000-04:00';
		const dateTime = new DateTime(dateParts);
		expect(dateTime.format(DateTime.patterns.ISO_DATE_TIME)).toBe(expected);
		expect(dateTime.valueOf()).toBe(new Date(...dateParts).valueOf());
  });

  it('parses millisecond up to 9 digits', () => {
    const date = '2019-03-25T06:41:00.999999999';
    const ds = new DateTime(date);
    const ms = new Date(date);
    expect(ds.valueOf()).toEqual(ms.valueOf());
    expect(ds.getMilliseconds()).toEqual(ms.getMilliseconds());
  });

  it('String Other, Undefined and Null and isValid', () => {
    expect(new DateTime('otherString').toString().toLowerCase()).toBe(new Date('otherString').toString().toLowerCase());
    expect(new DateTime().isValid()).toBe(true);
    expect(new DateTime(undefined).isValid()).toBe(true);
    expect(new DateTime('').isValid()).toBe(false);
    expect(new DateTime(null).isValid()).toBe(true);
    expect(new DateTime('otherString').isValid()).toBe(false);
    expect(new DateTime(null).toDate().toString().toLowerCase()).toBe(new Date().toString().toLowerCase());
  });
});

it('Epoch Timestamp Number (milliseconds) 1523520536000', () => {
  const timestamp = 1523520536000;
  expect(new DateTime(timestamp).valueOf()).toBe(new Date(timestamp).valueOf());
});

it('String and Number 20180101', () => {
  expect(new DateTime(20180101).valueOf()).toBe(new Date(20180101).valueOf());
  expect(DateTime.parse('20180101', 'YYYYMMDD').valueOf()).toBe(new Date(2018, 0, 1).valueOf());
});

it('Number 0', () => {
  expect(new DateTime(0).valueOf()).toBe(new Date(0).valueOf());
});

it('Clone not affect each other', () => {
  const base = new DateTime('2017-01-01');
  const another = base.add(1, DateTime.periods.YEARS);
  expect(base.getYear()).toBe(2017);
	expect(another.getYear()).toBe(2018);
	expect(base.diff(another, DateTime.periods.YEARS)).toBe(1);
});

it('Clone with same value', () => {
  const base = new DateTime();
  const year = base.getYear();
  const newBase = base.set(DateTime.fields.YEAR, year + 1);
  const another = new DateTime(newBase.valueOf());
  expect(newBase.toString()).toBe(another.toString());
});