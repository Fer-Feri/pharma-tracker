export type PharmacyType = 'pharmacy' | 'health';
export type Period = 1 | 3;
export type Status = 'red' | 'yellow' | 'green' | 'settled';
export type FilterType = 'all' | 'red' | 'yellow' | 'green';

export interface Invoice {
	id: number;
	date: string;
	amount: number;
	period: Period;
	settled: boolean;
	notes: string;
}

export interface Pharmacy {
	id: number;
	name: string;
	phone: string;
	type: PharmacyType;
	invoices: Invoice[];
}
