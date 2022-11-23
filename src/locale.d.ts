/**
 *
 *
 * @author Jason DiMeo <jason.dimeo@gmail.com>
 */
export default class Locale {
    /**
     *
     * @param {string} localeName
     * @param {boolean} [global]
     * @returns {Promise<Object>}
     */
    static import(localeName: string, global?: boolean): Promise<any>;
    /**
     * Adds a new {@link Locale} to the list of available Locales. If one already exists with the specified name, it will be replaced.
     *
     * @param {Object} localeOptions
     * @param {boolean} [global]
     */
    static add(localeOptions: any, global?: boolean): void;
    /**
     *
     * @param {string} localeName
     * @returns {Locale}
     */
    static get(localeName: string): Locale;
    /**
     * Sets the global locale to be used for all new {@link DateTime} instances if it has been added to the list of locales.
     *
     * @param {string} localeName
     * @returns {boolean} true if locale was successfully added or already imported. Otherwise, false.
     */
    static set(localeName: string): boolean;
    /**
     * Get the default locale for the current location.
     *
     * @returns {string}
     */
    static get defaultLocale(): string;
    /**
     * Create a new {@link Locale} instance.
     *
     * @param {Object} localeOptions
     * @param {string} localeOptions.name
     * @param {Object} localeOptions.patternTokens
     * @param {function(number): number} [localeOptions.ordinal=(day) => day]
     * @param {Array<string>} localeOptions.dayNames
     * @param {Array<string>} localeOptions.monthNames
     * @param {boolean} [global]
     */
    constructor({ name, patternTokens, ordinal, dayNames, monthNames }: {
        name: string;
        patternTokens: any;
        ordinal?: (arg0: number) => number;
        dayNames: Array<string>;
        monthNames: Array<string>;
    }, global?: boolean);
    /**
     * Gets the name of the current locale.
     *
     * @returns {string}
     */
    get name(): string;
    /**
     *
     * @returns {Object.<string, Intl.DateTimeFormat>}
     */
    get timeZoneFormatters(): {
        [x: string]: Intl.DateTimeFormat;
    };
    /**
     *
     * @returns {PatternFormat}
     */
    get patterns(): PatternFormat;
    /**
     *
     * @returns {function(number): number}
     */
    get ordinal(): (arg0: number) => number;
    /**
     *
     * @returns {DateParser}
     */
    get dateParser(): DateParser;
    /**
     *
     * @returns {Array<string>}
     */
    get dayNames(): string[];
    /**
     *
     * @returns {Array<string>}
     */
    get monthNames(): string[];
    /**
     *
     * @returns {string}
     */
    get [Symbol.toStringTag](): string;
    #private;
}
import PatternFormat from "./pattern-format.js";
import DateParser from "./date-parser.js";
