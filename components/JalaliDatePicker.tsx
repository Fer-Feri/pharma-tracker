'use client';

import { useState, useRef, useEffect } from 'react';
import moment from 'moment-jalaali';

interface Props {
	value: string; // میلادی: "2025-09-06"
	onChange: (gregorian: string) => void;
}

const MONTHS = [
	'فروردین',
	'اردیبهشت',
	'خرداد',
	'تیر',
	'مرداد',
	'شهریور',
	'مهر',
	'آبان',
	'آذر',
	'دی',
	'بهمن',
	'اسفند',
];

const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

function toJalali(gregorian: string) {
	return moment(gregorian, 'YYYY-MM-DD');
}

function getDaysInJMonth(jYear: number, jMonth: number) {
	return moment.jDaysInMonth(jYear, jMonth - 1);
}

function getFirstWeekday(jYear: number, jMonth: number) {
	// شنبه = 0
	const m = moment(`${jYear}/${jMonth}/1`, 'jYYYY/jM/jD');
	return (m.day() + 1) % 7; // تبدیل به شنبه‌اول
}

export default function JalaliDatePicker({ value, onChange }: Props) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const selected = value ? toJalali(value) : null;
	const today = moment();

	const [viewYear, setViewYear] = useState(selected ? selected.jYear() : today.jYear());
	const [viewMonth, setViewMonth] = useState(
		selected ? selected.jMonth() + 1 : today.jMonth() + 1,
	);

	// بستن با کلیک بیرون
	useEffect(() => {
		function handle(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener('mousedown', handle);
		return () => document.removeEventListener('mousedown', handle);
	}, []);

	function prevMonth() {
		if (viewMonth === 1) {
			setViewMonth(12);
			setViewYear((y) => y - 1);
		} else setViewMonth((m) => m - 1);
	}

	function nextMonth() {
		if (viewMonth === 12) {
			setViewMonth(1);
			setViewYear((y) => y + 1);
		} else setViewMonth((m) => m + 1);
	}

	function selectDay(day: number) {
		const m = moment(`${viewYear}/${viewMonth}/${day}`, 'jYYYY/jM/jD');
		onChange(m.format('YYYY-MM-DD'));
		setOpen(false);
	}

	function goToday() {
		const t = moment();
		setViewYear(t.jYear());
		setViewMonth(t.jMonth() + 1);
		onChange(t.format('YYYY-MM-DD'));
		setOpen(false);
	}

	const daysInMonth = getDaysInJMonth(viewYear, viewMonth);
	const firstWeekday = getFirstWeekday(viewYear, viewMonth);

	const selectedJDay = selected?.jDate();
	const selectedJMonth = selected ? selected.jMonth() + 1 : null;
	const selectedJYear = selected?.jYear();

	const todayJDay = today.jDate();
	const todayJMonth = today.jMonth() + 1;
	const todayJYear = today.jYear();

	const displayValue = selected
		? `${selected.jYear()}/${String(selected.jMonth() + 1).padStart(2, '0')}/${String(selected.jDate()).padStart(2, '0')}`
		: '';

	return (
		<div className="relative" ref={ref}>
			{/* Input */}
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm text-right flex items-center justify-between gap-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
				<span className={displayValue ? 'text-foreground' : 'text-muted-foreground'}>
					{displayValue || 'انتخاب تاریخ'}
				</span>
				<i className="ti ti-calendar text-muted-foreground text-sm shrink-0" />
			</button>

			{/* Popup */}
			{open && (
				<div className="absolute top-full mt-1 right-0 z-50 bg-card border border-border rounded-xl shadow-lg p-3 w-72">
					{/* Header */}
					<div className="flex items-center justify-between mb-3">
						<button
							onClick={nextMonth}
							className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
							<i className="ti ti-chevron-right text-sm" />
						</button>

						<div className="flex items-center gap-2">
							{/* month select */}
							<select
								value={viewMonth}
								onChange={(e) => setViewMonth(Number(e.target.value))}
								className="text-sm font-medium bg-transparent border-none outline-none cursor-pointer">
								{MONTHS.map((m, i) => (
									<option key={i} value={i + 1}>
										{m}
									</option>
								))}
							</select>
							{/* year select */}
							<select
								value={viewYear}
								onChange={(e) => setViewYear(Number(e.target.value))}
								className="text-sm font-medium bg-transparent border-none outline-none cursor-pointer">
								{Array.from({ length: 10 }, (_, i) => today.jYear() - 2 + i).map(
									(y) => (
										<option key={y} value={y}>
											{y}
										</option>
									),
								)}
							</select>
						</div>

						<button
							onClick={prevMonth}
							className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
							<i className="ti ti-chevron-left text-sm" />
						</button>
					</div>

					{/* Weekday headers */}
					<div className="grid grid-cols-7 mb-1">
						{WEEKDAYS.map((d) => (
							<div
								key={d}
								className="text-center text-xs text-muted-foreground py-1 font-medium">
								{d}
							</div>
						))}
					</div>

					{/* Days */}
					<div className="grid grid-cols-7 gap-y-0.5">
						{/* empty cells */}
						{Array.from({ length: firstWeekday }).map((_, i) => (
							<div key={`e-${i}`} />
						))}

						{Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
							const isSelected =
								day === selectedJDay &&
								viewMonth === selectedJMonth &&
								viewYear === selectedJYear;
							const isToday =
								day === todayJDay &&
								viewMonth === todayJMonth &&
								viewYear === todayJYear;

							return (
								<button
									key={day}
									onClick={() => selectDay(day)}
									className={`
                    h-8 w-full rounded-lg text-xs transition-colors
                    ${
						isSelected
							? 'bg-primary text-white font-medium'
							: isToday
								? 'border border-primary text-primary font-medium'
								: 'hover:bg-muted text-foreground'
					}
                  `}>
									{day}
								</button>
							);
						})}
					</div>

					{/* Footer */}
					<div className="mt-2 pt-2 border-t border-border">
						<button
							onClick={goToday}
							className="w-full text-xs text-primary hover:bg-muted rounded-lg py-1.5 transition-colors">
							امروز
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
