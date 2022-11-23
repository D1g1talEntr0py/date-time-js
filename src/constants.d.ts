export type Locale = import('./locale.js').default;
export type TimeZoneFormat = ('short' | 'long');
export namespace i18n {
    const locale: string | null;
    const locales: {
        [x: string]: Locale;
    };
    const localeOptions: {
        [x: string]: any;
    };
    const defaultLocale: string;
    const timeZoneFormats: {
        [x: string]: TimeZoneFormat;
    };
}
export namespace regExps {
    const nonWord: RegExp;
    const timeZoneOffset: RegExp;
    const formattingTokens: RegExp;
    const isoParsingPattern: RegExp;
}
/** @constant {Object.<string, string>} */
export const DateTimeUnit: Readonly<{
    YEAR: "year";
    MONTH: "month";
    DAY: "day";
    HOUR: "hour";
    MINUTE: "minute";
    SECOND: "second";
    MILLISECOND: "millisecond";
}>;
export namespace DateField {
    const year: string;
    const month: string;
    const day: string;
    const hour: string;
    const minute: string;
    const second: string;
    const millisecond: string;
    const dayOfTheWeek: string;
}
/** @constant {Object.<string, string>} */
export const PeriodUnit: Readonly<{
    YEARS: "years";
    MONTHS: "months";
    WEEKS: "days";
    DAYS: "days";
    HOURS: "hours";
    MINUTES: "minutes";
    SECONDS: "seconds";
    MILLISECONDS: "milliseconds";
}>;
/** @constant {Object.<string, string>} */
export const periodUnitFields: Readonly<{
    years: "year";
    months: "month";
    days: "day";
    hours: "hour";
    minutes: "minute";
    seconds: "second";
    milliseconds: "millisecond";
}>;
export namespace DateOperation {
    const ADD: string;
    const SUBTRACT: string;
}
export namespace DateParsingToken {
    const YEAR: string;
    const MONTH: string;
    const DAY: string;
    const HOUR_24: string;
    const HOUR_12: string;
    const MINUTE: string;
    const SECOND: string;
    const MILLISECOND: string;
    const ZONE_OFFSET: string;
    const MERIDIEM: string;
}
/** @constant {Object.<string, RegExp>} */
export const dateParserTokenMappings: {
    [x: string]: RegExp;
};
export namespace MillisecondsIn {
    const YEARS: number;
    const MONTHS: number;
    const DAYS: number;
    const HOURS: number;
    const MINUTES: number;
    const SECONDS: number;
    const MILLISECONDS: number;
}
