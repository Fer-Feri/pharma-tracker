import moment from 'moment-jalaali';

// شمسی → میلادی (برای ذخیره در DB)
export function jalaliToGregorian(jalaliStr: string): string {
	// ورودی: 1404/06/15
	const m = moment(jalaliStr, 'jYYYY/jMM/jDD');
	return m.format('YYYY-MM-DD');
}

// میلادی → شمسی (برای نمایش در UI)
export function gregorianToJalali(gregorianStr: string): string {
	// ورودی: 2025-09-06
	const m = moment(gregorianStr, 'YYYY-MM-DD');
	return m.format('jYYYY/jMM/jDD');
}

// اعتبارسنجی تاریخ شمسی
export function isValidJalali(str: string): boolean {
	return moment(str, 'jYYYY/jMM/jDD').isValid();
}
