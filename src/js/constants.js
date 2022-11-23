// eslint-disable-next-line jsdoc/valid-types
/** @typedef { import('./locale.js').default } Locale */
/** @typedef {('short'|'long')} TimeZoneFormat */

/** @constant {Object.<string, *>} */
const i18n = {
	/** @type {?string} */
	locale: undefined,
	/** @type {Object.<string, Locale>} */
	locales: {},
	/** @type {Object.<string, Object>} */
	localeOptions: {},
	/** @type {string} */
	defaultLocale: Intl.NumberFormat().resolvedOptions().locale,
	/** @type {Object.<string, TimeZoneFormat>} */
	timeZoneFormats: Object.freeze({ SHORT: 'short',	LONG: 'long' })
};

/** @constant {Object.<string, RegExp>} */
const regExps = {
	nonWord: /[\W_]/,
	timeZoneOffset: /^(?:GMT)([+-])(0\d|1\d|2[0-3])[:|.]([0-5]\d)[:|.]?([0-5]\d)?$/,
	formattingTokens: /\[([^\]]+)]|YYYY|M{1,4}|Do|D{1,2}|d{1,3}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|SSS|Z{1,2}|z{1,3}|a|A/g,
	isoParsingPattern: /^(?<year>\d{4})-(?<month>0[1-9]|1[0-2])-(?<day>0[1-9]|[12][\d]|[3][01])[\sT]?(?<hour>0\d|1\d|2[0-3])?:?(?<minute>[0-5]\d)?:?(?<second>[0-5]\d)?[.:]?(?<millisecond>\d{1,9})?(?<zoneOffset>[+-]\d\d:?\d\d|Z)?$/
};

/** @constant {Object.<string, string>} */
const DateTimeUnit = Object.freeze({
	YEAR: 'year',
	MONTH: 'month',
	DAY: 'day',
	HOUR: 'hour',
	MINUTE: 'minute',
	SECOND: 'second',
	MILLISECOND: 'millisecond'
});

/** @constant {Object.<string, string>} */
const DateField = {
	[DateTimeUnit.YEAR]: 'FullYear',
	[DateTimeUnit.MONTH]: 'Month',
	[DateTimeUnit.DAY]: 'Date',
	[DateTimeUnit.HOUR]: 'Hours',
	[DateTimeUnit.MINUTE]: 'Minutes',
	[DateTimeUnit.SECOND]: 'Seconds',
	[DateTimeUnit.MILLISECOND]: 'Milliseconds',
	dayOfTheWeek: 'Day'
};

/** @constant {Object.<string, string>} */
const PeriodUnit = Object.freeze({
	YEARS: `${DateTimeUnit.YEAR}s`,
	MONTHS: `${DateTimeUnit.MONTH}s`,
	WEEKS: `${DateTimeUnit.DAY}s`,
	DAYS: `${DateTimeUnit.DAY}s`,
	HOURS: `${DateTimeUnit.HOUR}s`,
	MINUTES: `${DateTimeUnit.MINUTE}s`,
	SECONDS: `${DateTimeUnit.SECOND}s`,
	MILLISECONDS: `${DateTimeUnit.MILLISECOND}s`
});

/** @constant {Object.<string, string>} */
const periodUnitFields = Object.freeze({
	[PeriodUnit.YEARS]: DateTimeUnit.YEAR,
	[PeriodUnit.MONTHS]: DateTimeUnit.MONTH,
	[PeriodUnit.WEEKS]: DateTimeUnit.DAY,
	[PeriodUnit.DAYS]: DateTimeUnit.DAY,
	[PeriodUnit.HOURS]: DateTimeUnit.HOUR,
	[PeriodUnit.MINUTES]: DateTimeUnit.MINUTE,
	[PeriodUnit.SECONDS]: DateTimeUnit.SECOND,
	[PeriodUnit.MILLISECONDS]: DateTimeUnit.MILLISECOND
});

/** @constant {Object.<string, string>} */
const DateOperation = { ADD: 'add', SUBTRACT: 'subtract' };

/** @constant {Object.<string, string>} */
const DateParsingToken = { YEAR: 'Y', MONTH: 'M', DAY: 'D', HOUR_24: 'H', HOUR_12: 'h', MINUTE: 'm', SECOND: 's', MILLISECOND: 'S', ZONE_OFFSET: 'Z', MERIDIEM: 'A' };

/** @constant {Object.<string, RegExp>} */
const dateParserTokenMappings = {
	[DateParsingToken.YEAR]: /(?<year>\d{4})/,
	[DateParsingToken.MONTH]: /(?<month>0?[1-9]|1[0-2])/,
	[DateParsingToken.DAY]: /(?<day>0?[1-9]|[12]\d|3[01])/,
	[DateParsingToken.HOUR_24]: /(?<hour>[01]?\d|2[0-3])/,
	[DateParsingToken.HOUR_12]: /(?<hour>0?[1-9]|1[0-2])/,
	[DateParsingToken.MINUTE]: /(?<minute>[0-5]\d|\d)/,
	[DateParsingToken.SECOND]: /(?<second>[0-5]\d|\d)/,
	[DateParsingToken.MILLISECOND]: /(?<millisecond>\d{1,3})?/,
	[DateParsingToken.ZONE_OFFSET]: /(?<zoneOffset>[+-]\d\d:?\d\d|Z)/,
	[DateParsingToken.MERIDIEM]: /(?<meridiem>[AaPp][Mm]|[AaPp]\.[Mm]\.)/
};

/** @constant {Object.<string, number>} */
const MillisecondsIn = {
	YEARS: 3.1536e10,
	MONTHS: 2.592e9,
	DAYS: 8.64e7,
	HOURS: 3.6e6,
	MINUTES: 6e4,
	SECONDS: 1e3,
	MILLISECONDS: 1
};

export { i18n, regExps, DateTimeUnit, DateField, PeriodUnit, periodUnitFields, DateOperation, DateParsingToken, dateParserTokenMappings, MillisecondsIn };