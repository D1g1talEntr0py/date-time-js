import DateTime from '../src/date-time.js';
import Locale from '../src/locale.js';
import Period from '../src/period.js';
import Duration from '../src/duration.js';

const { locale = 'en-US', global = 'true' } = Object.fromEntries(new URL(import.meta.url).searchParams);

await Locale.import(locale, global == 'true');

export { DateTime, Locale, Period, Duration };