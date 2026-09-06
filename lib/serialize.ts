import type { Pharmacy, Invoice, Period, PharmacyType } from '@/types';

export function serializeInvoice(inv: {
	id: number;
	date: Date | string;
	amount: bigint | number;
	period: number;
	settled: boolean;
	notes: string;
	pharmacyId?: number;
	createdAt?: Date;
}): Invoice {
	return {
		id: inv.id,
		date: inv.date instanceof Date ? inv.date.toISOString().split('T')[0] : inv.date,
		amount: Number(inv.amount),
		period: inv.period as Period,
		settled: inv.settled,
		notes: inv.notes,
	};
}

export function serializePharmacy(p: {
	id: number;
	name: string;
	phone: string;
	type: string;
	createdAt?: Date;
	invoices?: {
		id: number;
		date: Date | string;
		amount: bigint | number;
		period: number;
		settled: boolean;
		notes: string;
		pharmacyId?: number;
		createdAt?: Date;
	}[];
}): Pharmacy {
	return {
		id: p.id,
		name: p.name,
		phone: p.phone,
		type: p.type as PharmacyType,
		invoices: (p.invoices ?? []).map(serializeInvoice),
	};
}
