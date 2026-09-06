import type { Invoice, Pharmacy } from '@/types';

export function getDaysLeft(dateStr: string, periodMonths: number): number {
	const due = new Date(dateStr);
	due.setDate(due.getDate() + periodMonths * 30);
	const now = new Date();
	return Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getInvoiceStatus(inv: Invoice): 'red' | 'yellow' | 'green' | 'settled' {
	if (inv.settled) return 'settled';
	const d = getDaysLeft(inv.date, inv.period);
	if (d <= 4) return 'red';
	if (d <= 7) return 'yellow';
	return 'green';
}

export function getPharmacyStatus(ph: Pharmacy): 'red' | 'yellow' | 'green' {
	const active = ph.invoices.filter((i) => !i.settled);
	if (!active.length) return 'green';
	const statuses = active.map(getInvoiceStatus);
	if (statuses.includes('red')) return 'red';
	if (statuses.includes('yellow')) return 'yellow';
	return 'green';
}

export function formatAmount(n: number): string {
	return new Intl.NumberFormat('fa-IR').format(n) + ' ریال';
}

export function daysText(d: number): string {
	if (d < 0) return 'سررسید گذشته';
	if (d === 0) return 'امروز';
	return `${d} روز مانده`;
}
