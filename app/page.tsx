'use client';

import { useState } from 'react';
import type { Pharmacy, FilterType } from '@/types';
import FilterBar from '@/components/FilterBar';
import PharmacyList from '@/components/PharmacyList';
import PharmacyModal from '@/components/modals/PharmacyModal';

const SEED: Pharmacy[] = [
	{
		id: 1,
		name: 'داروخانه بهاری',
		phone: '09181234567',
		type: 'pharmacy',
		invoices: [
			{
				id: 11,
				date: '2025-08-01',
				amount: 8500000,
				period: 1,
				settled: false,
				notes: 'هفته آینده تسویه می‌کند',
			},
			{ id: 12, date: '2025-08-20', amount: 3200000, period: 1, settled: false, notes: '' },
		],
	},
	{
		id: 2,
		name: 'مرکز بهداشت شهری',
		phone: '08733334444',
		type: 'health',
		invoices: [
			{ id: 21, date: '2025-07-15', amount: 15000000, period: 3, settled: false, notes: '' },
		],
	},
];

export default function Home() {
	const [pharmacies, setPharmacies] = useState<Pharmacy[]>(SEED);
	const [filter, setFilter] = useState<FilterType>('all');
	const [showAddModal, setShowAddModal] = useState(false);

	function addPharmacy(data: { name: string; phone: string; type: Pharmacy['type'] }) {
		setPharmacies((prev) => [...prev, { id: Date.now(), invoices: [], ...data }]);
	}

	function updatePharmacy(id: number, data: { name: string; phone: string }) {
		setPharmacies((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
	}

	function deletePharmacy(id: number) {
		setPharmacies((prev) => prev.filter((p) => p.id !== id));
	}

	function addInvoice(
		phId: number,
		data: { date: string; amount: number; period: 1 | 3; notes: string },
	) {
		setPharmacies((prev) =>
			prev.map((p) =>
				p.id === phId
					? {
							...p,
							invoices: [...p.invoices, { id: Date.now(), settled: false, ...data }],
						}
					: p,
			),
		);
	}

	function updateInvoice(
		phId: number,
		invId: number,
		data: Partial<{ date: string; amount: number; period: 1 | 3; notes: string }>,
	) {
		setPharmacies((prev) =>
			prev.map((p) =>
				p.id === phId
					? {
							...p,
							invoices: p.invoices.map((i) =>
								i.id === invId ? { ...i, ...data } : i,
							),
						}
					: p,
			),
		);
	}

	function settleInvoice(phId: number, invId: number) {
		updateInvoice(phId, invId, { settled: true } as never);
		setPharmacies((prev) =>
			prev.map((p) =>
				p.id === phId
					? {
							...p,
							invoices: p.invoices.map((i) =>
								i.id === invId ? { ...i, settled: true } : i,
							),
						}
					: p,
			),
		);
	}

	function deleteInvoice(phId: number, invId: number) {
		setPharmacies((prev) =>
			prev.map((p) =>
				p.id === phId ? { ...p, invoices: p.invoices.filter((i) => i.id !== invId) } : p,
			),
		);
	}

	return (
		<main className="max-w-2xl mx-auto px-4 py-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
				<h1 className="text-lg font-medium flex items-center gap-2">
					<i className="ti ti-building-store text-primary text-xl" />
					پیگیری حساب‌ها
				</h1>
				<button
					onClick={() => setShowAddModal(true)}
					className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
					<i className="ti ti-plus" />
					داروخانه جدید
				</button>
			</div>

			{/* Filter */}
			<FilterBar filter={filter} onChange={setFilter} />

			{/* List */}
			<PharmacyList
				pharmacies={pharmacies}
				filter={filter}
				onUpdatePharmacy={updatePharmacy}
				onDeletePharmacy={deletePharmacy}
				onAddInvoice={addInvoice}
				onUpdateInvoice={updateInvoice}
				onSettleInvoice={settleInvoice}
				onDeleteInvoice={deleteInvoice}
			/>

			{/* Add pharmacy modal */}
			{showAddModal && (
				<PharmacyModal
					onClose={() => setShowAddModal(false)}
					onSave={(data) => {
						addPharmacy(data);
						setShowAddModal(false);
					}}
				/>
			)}
		</main>
	);
}
