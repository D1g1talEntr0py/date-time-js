import { expect, describe, it, test } from '@jest/globals';
import DateTime from '../src/js/date-time.js';

const checkDateProperties = (type, dateTime, date) => {
  const _get = (date, field) => date[`${dateTime.isUtc() ? 'getUTC' : 'get'}${field}`]();

  it('Should be valid', () => expect(dateTime.toDate().toString()).not.toBe('Invalid Date'));
  it('Should have same year as native Date', () => expect(dateTime.getYear()).toBe(_get(date, 'FullYear')));
  // Native JavaScript Date uses 0-based months. ლ(ಠ益ಠლ)
  it('Should have same month as native Date', () => expect(dateTime.getMonth()).toBe(_get(date, 'Month') + 1));
  it('Should have same day as native Date', () => expect(dateTime.getDay()).toBe(_get(date, 'Date')));
  it('Should have same hours as native Date', () => expect(dateTime.getHours()).toBe(_get(date, 'Hours')));
  it('Should have same minutes as native Date', () => expect(dateTime.getMinutes()).toBe(_get(date, 'Minutes')));
  it('Should have same seconds as native Date', () => expect(dateTime.getSeconds()).toBe(_get(date, 'Seconds')));
  // Because the 2 Date objects were instantiated separately using the default constructor, 
  // 'dateTime' could have milliseconds that are equal or greater than 'date'
  it('Should have milliseconds less than or equal to native Date', () => expect(dateTime.getMilliseconds()).toBeLessThanOrEqual(_get(date, 'Milliseconds')));
};

test('Invalid Date', () => {
  expect(new DateTime('date').toDate().toString()).toBe('Invalid Date');
});

describe.each([
  ['default', new DateTime(), new Date()],
  (() => {
    const date = new Date();
    return ['date', new DateTime(date), date];
  })(),
  (() => {
    const now = Date.now();
    return ['Number', new DateTime(now), new Date(now)];
  })(),
  ['String', new DateTime('1986-10-14T22:05:18.334'), new Date(1986, 9, 14, 22, 5, 18, 334)],
  ['Array', new DateTime([1986, 10, 14, 22, 5, 18, 334]), new Date(1986, 9, 14, 22, 5, 18, 334)],
  ['null', new DateTime(null), new Date()],
  ['undefined', new DateTime(undefined), new Date()],
  (() => {
    const date = new Date();
    const dateTime = new DateTime(date);
    return ['DateTime', new DateTime(dateTime), date];
  })()
])('Check DateTime properties using "%s" constructor', checkDateProperties);

describe.each([
  (() => {
    const date = new Date();
    return ['date', new DateTime(date, { utc: true }), date];
  })(),
  (() => {
    const now = new Date();
    const utcNow = new Date(+now + now.getTimezoneOffset() * 6e4);
    return ['Number', new DateTime(+now, { utc: true }), utcNow];
  })(),
  ['String', new DateTime('1986-10-14T22:05:18.334', { utc: true }), new Date(Date.UTC(1986, 9, 14, 22, 5, 18, 334))],
  ['Array', new DateTime([1986, 10, 14, 22, 5, 18, 334], { utc: true }), new Date(Date.UTC(1986, 9, 14, 22, 5, 18, 334))],
  (() => {
    const d = new Date();
    d.setMilliseconds(d.getMilliseconds() + d.getTimezoneOffset() * 6e4);
    return ['null', new DateTime(null, { utc: true }), d];
  })(),
  (() => {
    const dateTime = new DateTime(undefined, { utc: true });
    const d = new Date();
    d.setMilliseconds(d.getMilliseconds() + d.getTimezoneOffset() * 6e4);
    return ['undefined', dateTime, d];
  })(),
  (() => {
    const d = new Date();
    d.setMilliseconds(d.getMilliseconds() + d.getTimezoneOffset() * 6e4);
    return ['boolean', new DateTime(true), d];
  })(),
  (() => {
    const date = new Date();
    return ['DateTime',new DateTime(date, { utc: true }), date];
  })()
])('Check DateTime properties using "%s" constructor with the UTC parameter option', checkDateProperties);

describe.each([
  ['parse', DateTime.parse('19861014 10:8:2', 'YYYYMMDD hh:m:s'), new Date(1986, 9, 14, 10, 8, 2)],
  ['utc', DateTime.utc('19861014 10:8:2', 'YYYYMMDD hh:m:s'), new Date(Date.UTC(1986, 9, 14, 10, 8, 2))],
  ['orNull', DateTime.orNull('1986-10-14T10:08:02'), new Date(1986, 9, 14, 10, 8, 2)]
])('Check properties using static %s method', checkDateProperties);



// test('is same without units', () => {
//   const m = new DateTime(new Date(2011, 3, 2, 3, 4, 5, 10));
//   const mCopy = new DateTime(m)

//   expect(m.equals(new DateTime(new Date(2012, 3, 2, 3, 5, 5, 10)))).toBe(false, 'year is later')
//   expect(m.equals(new DateTime(new Date(2010, 3, 2, 3, 3, 5, 10)))).toBe(false, 'year is earlier')
//   expect(m.equals(new DateTime(new Date(2011, 4, 2, 3, 4, 5, 10)))).toBe(false, 'month is later')
//   expect(m.equals(new DateTime(new Date(2011, 2, 2, 3, 4, 5, 10)))).toBe(false, 'month is earlier')
//   expect(m.equals(new DateTime(new Date(2011, 3, 3, 3, 4, 5, 10)))).toBe(false, 'day is later')
//   expect(m.equals(new DateTime(new Date(2011, 3, 1, 3, 4, 5, 10)))).toBe(false, 'day is earlier')
//   expect(m.equals(new DateTime(new Date(2011, 3, 2, 4, 4, 5, 10)))).toBe(false, 'hour is later')
//   expect(m.equals(new DateTime(new Date(2011, 3, 2, 2, 4, 5, 10)))).toBe(false, 'hour is earlier')
//   expect(m.equals(new DateTime(new Date(2011, 3, 2, 3, 5, 5, 10)))).toBe(false, 'minute is later')
//   expect(m.equals(new DateTime(new Date(2011, 3, 2, 3, 3, 5, 10)))).toBe(false, 'minute is earlier')
//   expect(m.equals(new DateTime(new Date(2011, 3, 2, 3, 4, 6, 10)))).toBe(false, 'second is later')
//   expect(m.equals(new DateTime(new Date(2011, 3, 2, 3, 4, 4, 11)))).toBe(false, 'second is earlier')
//   expect(m.equals(new DateTime(new Date(2011, 3, 2, 3, 4, 5, 10)))).toBe(true, 'millisecond match')
//   expect(m.equals(new DateTime(new Date(2011, 3, 2, 3, 4, 5, 11)))).toBe(false, 'millisecond is later')
//   expect(m.equals(new DateTime(new Date(2011, 3, 2, 3, 4, 5, 9)))).toBe(false, 'millisecond is earlier')
//   expect(m.equals(m)).toBe(true, 'moments are the same as themselves')
//   expect(+m).toEqual(+mCopy, 'isSame second should not change moment')
// });