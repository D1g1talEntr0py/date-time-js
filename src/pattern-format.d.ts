export default class PatternFormat {
    static ISO_DATE: string;
    static ISO_TIME: string;
    static ISO_DATE_TIME: string;
    static DEFAULT: string;
    static RFC_1123: string;
    static DATE: any;
    static TIME: any;
    static DATE_TIME: any;
    static TIME_WITH_SECONDS: any;
    static DATE_TIME_WITH_SECONDS: any;
    static LONG_DATE: any;
    static LONG_DATE_TIME: any;
    static LONG_DATE_TIME_ZONE: any;
    static FULL_DATE: any;
    static FULL_DATE_TIME: any;
    static FULL_DATE_TIME_ZONE: any;
    static ABBR_DATE: any;
    static ABBR_DATE_TIME_ZONE: any;
    static ABBR_LONG_DATE: any;
    static ABBR_LONG_DATE_TIME: any;
    static ABBR_LONG_DATE_TIME_ZONE: any;
    static ABBR_FULL_DATE: any;
    static ABBR_FULL_DATE_TIME: any;
    static ABBR_FULL_DATE_TIME_ZONE: any;
    /**
     * Creates the locale patterns for parsing dates in based on the possible pattern tokens provided.
     *
     * @param {Object.<string, string>} patternTokens The locale pattern tokens to use for formatting.
     * @author Jason DiMeo <jason.dimeo@gmail.com>
     */
    constructor(patternTokens: {
        [x: string]: string;
    });
    /** @type {string} */
    ISO_DATE: string;
    /** @type {string} */
    ISO_TIME: string;
    /** @type {string} */
    ISO_DATE_TIME: string;
    /** @type {string} */
    DEFAULT: string;
    /** @type {string} */
    RFC_1123: string;
    /** @type {string} */
    DATE: string;
    /** @type {string} */
    TIME: string;
    /** @type {string} */
    DATE_TIME: string;
    /** @type {string} */
    TIME_WITH_SECONDS: string;
    /** @type {string} */
    DATE_TIME_WITH_SECONDS: string;
    /** @type {string} */
    LONG_DATE: string;
    /** @type {string} */
    LONG_DATE_TIME: string;
    /** @type {string} */
    LONG_DATE_TIME_ZONE: string;
    /** @type {string} */
    FULL_DATE: string;
    /** @type {string} */
    FULL_DATE_TIME: string;
    /** @type {string} */
    FULL_DATE_TIME_ZONE: string;
    /** @type {string} */
    ABBR_DATE: string;
    /** @type {string} */
    ABBR_DATE_TIME: string;
    /** @type {string} */
    ABBR_DATE_TIME_ZONE: string;
    /** @type {string} */
    ABBR_LONG_DATE: string;
    /** @type {string} */
    ABBR_LONG_DATE_TIME: string;
    /** @type {string} */
    ABBR_LONG_DATE_TIME_ZONE: string;
    /** @type {string} */
    ABBR_FULL_DATE: string;
    /** @type {string} */
    ABBR_FULL_DATE_TIME: string;
    /** @type {string} */
    ABBR_FULL_DATE_TIME_ZONE: string;
}
