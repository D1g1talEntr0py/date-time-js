export default class PatternFormat {
	/**
	 * Creates the locale patterns for parsing dates in based on the possible pattern tokens provided.
	 *
	 * @param {Object.<string, string>} patternTokens The locale pattern tokens to use for formatting.
	 * @author Jason DiMeo <jason.dimeo@gmail.com>
	 */
	constructor(patternTokens) {
		/** @type {string} */
		this.ISO_DATE = this.constructor.ISO_DATE;
		/** @type {string} */
		this.ISO_TIME = this.constructor.ISO_TIME;
		/** @type {string} */
		this.ISO_DATE_TIME = this.constructor.ISO_DATE_TIME;
		/** @type {string} */
		this.DEFAULT = this.constructor.DEFAULT;
		/** @type {string} */
		this.RFC_1123 = this.constructor.RFC_1123;
		/** @type {string} */
		this.DATE = patternTokens.D;
		/** @type {string} */
		this.TIME = patternTokens.T;
		/** @type {string} */
		this.DATE_TIME = `${patternTokens.D} ${patternTokens.T}`;
		/** @type {string} */
		this.TIME_WITH_SECONDS = patternTokens.TS;
		/** @type {string} */
		this.DATE_TIME_WITH_SECONDS = `${patternTokens.D} ${patternTokens.TS}`;
		/** @type {string} */
		this.LONG_DATE = patternTokens.DD;
		/** @type {string} */
		this.LONG_DATE_TIME = `${patternTokens.DD} ${patternTokens.T}`;
		/** @type {string} */
		this.LONG_DATE_TIME_ZONE = `${patternTokens.DD} ${patternTokens.T} zzz`;
		/** @type {string} */
		this.FULL_DATE = patternTokens.DDD;
		/** @type {string} */
		this.FULL_DATE_TIME = `${patternTokens.DDD} ${patternTokens.T}`;
		/** @type {string} */
		this.FULL_DATE_TIME_ZONE = `${patternTokens.DDD} ${patternTokens.T} zzz`;
		/** @type {string} */
		this.ABBR_DATE = patternTokens.d;
		/** @type {string} */
		this.ABBR_DATE_TIME = `${patternTokens.d} ${patternTokens.T}`;
		/** @type {string} */
		this.ABBR_DATE_TIME_ZONE = `${patternTokens.d} ${patternTokens.T} z`;
		/** @type {string} */
		this.ABBR_LONG_DATE = patternTokens.dd;
		/** @type {string} */
		this.ABBR_LONG_DATE_TIME = `${patternTokens.dd} ${patternTokens.T}`;
		/** @type {string} */
		this.ABBR_LONG_DATE_TIME_ZONE = `${patternTokens.dd} ${patternTokens.T} z`;
		/** @type {string} */
		this.ABBR_FULL_DATE = patternTokens.ddd;
		/** @type {string} */
		this.ABBR_FULL_DATE_TIME = `${patternTokens.ddd} ${patternTokens.T}`;
		/** @type {string} */
		this.ABBR_FULL_DATE_TIME_ZONE = `${patternTokens.ddd} ${patternTokens.T} z`;
		Object.freeze(this);
	}

	static ISO_DATE = 'YYYY-MM-DD';
	static ISO_TIME = 'HH:mm:ss.SSSZ';
	static ISO_DATE_TIME = `${PatternFormat.ISO_DATE}[T]${PatternFormat.ISO_TIME}`;
	static DEFAULT = 'dd MMM DD YYYY HH:mm:ss ZZ';
	static RFC_1123 = 'dd, DD MMM YYYY HH:mm:ss z';
	static DATE = this.constructor.DATE;
	static TIME = this.constructor.TIME;
	static DATE_TIME = this.constructor.DATE_TIME;
	static TIME_WITH_SECONDS = this.constructor.TIME_WITH_SECONDS;
	static DATE_TIME_WITH_SECONDS = this.constructor.DATE_TIME_WITH_SECONDS;
	static LONG_DATE = this.constructor.LONG_DATE;
	static LONG_DATE_TIME = this.constructor.LONG_DATE_TIME;
	static LONG_DATE_TIME_ZONE = this.constructor.LONG_DATE_TIME_ZONE;
	static FULL_DATE = this.constructor.FULL_DATE;
	static FULL_DATE_TIME = this.constructor.FULL_DATE_TIME;
	static FULL_DATE_TIME_ZONE = this.constructor.FULL_DATE_TIME_ZONE;
	static ABBR_DATE = this.constructor.ABBR_DATE;
	static ABBR_DATE_TIME_ZONE = this.constructor.ABBR_DATE_TIME_ZONE;
	static ABBR_LONG_DATE = this.constructor.ABBR_LONG_DATE;
	static ABBR_LONG_DATE_TIME = this.constructor.ABBR_LONG_DATE_TIME;
	static ABBR_LONG_DATE_TIME_ZONE = this.constructor.ABBR_LONG_DATE_TIME_ZONE;
	static ABBR_FULL_DATE = this.constructor.ABBR_FULL_DATE;
	static ABBR_FULL_DATE_TIME = this.constructor.ABBR_FULL_DATE_TIME;
	static ABBR_FULL_DATE_TIME_ZONE = this.constructor.ABBR_FULL_DATE_TIME_ZONE;
}