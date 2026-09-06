import type { Pharmacy, Invoice } from '@/types';

// ── Pharmacies ──────────────────────────────────────────

export async function fetchPharmacies(): Promise<Pharmacy[]> {
	const res = await fetch('/api/pharmacies');
	return res.json();
}

export async function createPharmacy(data: {
	name: string;
	phone: string;
	type: string;
}): Promise<Pharmacy> {
	const res = await fetch('/api/pharmacies', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	return res.json();
}

export async function updatePharmacy(
	id: number,
	data: { name: string; phone: string },
): Promise<Pharmacy> {
	const res = await fetch(`/api/pharmacies/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	return res.json();
}

export async function deletePharmacy(id: number): Promise<void> {
	await fetch(`/api/pharmacies/${id}`, { method: 'DELETE' });
}

// ── Invoices ────────────────────────────────────────────

export async function createInvoice(
	pharmacyId: number,
	data: { date: string; amount: number; period: number; notes: string },
): Promise<Invoice> {
	const res = await fetch('/api/invoices', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ pharmacyId, ...data }),
	});
	return res.json();
}

export async function updateInvoice(
	id: number,
	data: Partial<{
		date: string;
		amount: number;
		period: number;
		notes: string;
		settled: boolean;
	}>,
): Promise<Invoice> {
	const res = await fetch(`/api/invoices/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	return res.json();
}

export async function deleteInvoice(id: number): Promise<void> {
	await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
}
