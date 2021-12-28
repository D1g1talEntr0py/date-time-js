import { it, describe, expect, test } from '@jest/globals';
import DateTime from '../src/js/date-time.js';
import Duration from '../src/js/duration.js';

const defaultDurations = { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };

const checkConstructorParameters = (type, duration, constructorParameters = defaultDurations) => {
	it('Should have same years as parameter', () => expect(duration.years).toBe(constructorParameters.years));
	it('Should have same months as parameter', () => expect(duration.months).toBe(constructorParameters.months));
	it('Should have same days as parameter', () => expect(duration.days).toBe(constructorParameters.days));
	it('Should have same hours as parameter', () => expect(duration.hours).toBe(constructorParameters.hours));
	it('Should have same minutes as parameter', () => expect(duration.minutes).toBe(constructorParameters.minutes));
	it('Should have same seconds as parameter', () => expect(duration.seconds).toBe(constructorParameters.seconds));
	it('Should have same milliseconds as parameter', () => expect(duration.milliseconds).toBe(constructorParameters.milliseconds));
};

describe.each([
	['No Argument', new DateTime.Duration()],
	['Years', new DateTime.Duration({ years: 28 }), Object.assign({}, defaultDurations, { years: 28 })],
	['Months', new DateTime.Duration({ months: 52 }), Object.assign({}, defaultDurations, { months: 52 })],
	['Days', new DateTime.Duration({ days: 30 }), Object.assign({}, defaultDurations, { days: 30 })],
	['Hours', new DateTime.Duration({ hours: 210 }), Object.assign({}, defaultDurations, { hours: 210 })],
	['Minutes', new DateTime.Duration({ minutes: 542 }), Object.assign({}, defaultDurations, { minutes: 542 })],
	['Seconds', new DateTime.Duration({ seconds: 72 }), Object.assign({}, defaultDurations, { seconds: 72 })],
	['Milliseconds', new DateTime.Duration({ milliseconds: 5600 }), Object.assign({}, defaultDurations, { milliseconds: 5600 })],
	['Object', new DateTime.Duration({ years: 28, months: 52, days: 30, hours: 210, minutes: 542, seconds: 72, milliseconds: 5600 }), { years: 28, months: 52, days: 30, hours: 210, minutes: 542, seconds: 72, milliseconds: 5600 }]
])('Checking "%s" constructor parameters', checkConstructorParameters);

describe.each([
	['No Argument', new DateTime.Duration()],
	['Years', new DateTime.Duration({ years: 28 }).normalize(), Object.assign({}, defaultDurations, { years: 28 })],
	['Months', new DateTime.Duration({ months: 52 }).normalize(), Object.assign({}, defaultDurations, { years: 4, months: 4 })],
	['Days', new DateTime.Duration({ days: 30 }).normalize(), Object.assign({}, defaultDurations, { months: 1 })],
	['Hours', new DateTime.Duration({ hours: 210 }).normalize(), Object.assign({}, defaultDurations, { days: 8, hours: 18 })],
	['Minutes', new DateTime.Duration({ minutes: 542 }).normalize(), Object.assign({}, defaultDurations, { hours: 9, minutes: 2 })],
	['Seconds', new DateTime.Duration({ seconds: 72 }).normalize(), Object.assign({}, defaultDurations, { minutes: 1, seconds: 12 })],
	['Milliseconds', new DateTime.Duration({ milliseconds: 5600 }).normalize(), Object.assign({}, defaultDurations, { seconds: 5, milliseconds: 600 })],
	['Object', new DateTime.Duration({ years: 28, months: 52, days: 30, hours: 210, minutes: 542, seconds: 72, milliseconds: 5600 }).normalize(), { years: 32, months: 5, days: 9, hours: 3, minutes: 3, seconds: 17, milliseconds: 600 }]
])('Checking normalized "%s" constructor parameters', checkConstructorParameters);


test('Duration from Timestamp', () => {
	const epochDateTime = new DateTime('2021-06-30T18:22:03');
	const dateTime = new DateTime('2022-03-10T15:08:56');

	let duration = Duration.fromTimestamp(dateTime.valueOf());
	expect(dateTime.valueOf()).toBe(duration.asMilliseconds());

	duration = Duration.between(epochDateTime, dateTime);
	expect(dateTime.diff(epochDateTime)).toBe(duration.asMilliseconds());
	expect(dateTime.subtract(duration)).toEqual(epochDateTime);
	expect(epochDateTime.add(duration)).toEqual(dateTime);
});

// test('Duration between', () => {

// });