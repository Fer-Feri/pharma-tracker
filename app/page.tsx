'use client';

import { useState, useEffect } from 'react';
import type { Pharmacy, FilterType, Invoice } from '@/types';
import FilterBar from '@/components/FilterBar';
import PharmacyList from '@/components/PharmacyList';
import PharmacyModal from '@/components/modals/PharmacyModal';
import * as api from '@/lib/api';

export default function Home() {
	const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
	const [filter, setFilter] = useState<FilterType>('all');
	const [showAddModal, setShowAddModal] = useState(false);
	const [loading, setLoading] = useState(true);

	// ── Load ──────────────────────────────────────────────
	useEffect(() => {
		api.fetchPharmacies().then((data) => {
			setPharmacies(data);
			setLoading(false);
		});
	}, []);

	// ── Pharmacy handlers ─────────────────────────────────
	async function addPharmacy(data: { name: string; phone: string; type: Pharmacy['type'] }) {
		const created = await api.createPharmacy(data);
		setPharmacies((prev) => [...prev, { ...created, invoices: [] }]);
	}

	async function updatePharmacy(id: number, data: { name: string; phone: string }) {
		const updated = await api.updatePharmacy(id, data);
		setPharmacies((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
	}

	async function deletePharmacy(id: number) {
		await api.deletePharmacy(id);
		setPharmacies((prev) => prev.filter((p) => p.id !== id));
	}

	// ── Invoice handlers ──────────────────────────────────
	async function addInvoice(
		phId: number,
		data: { date: string; amount: number; period: 1 | 3; notes: string },
	) {
		const created = await api.createInvoice(phId, data);
		setPharmacies((prev) =>
			prev.map((p) => (p.id === phId ? { ...p, invoices: [...p.invoices, created] } : p)),
		);
	}

	async function updateInvoice(phId: number, invId: number, data: Partial<Invoice>) {
		const updated = await api.updateInvoice(invId, data);
		setPharmacies((prev) =>
			prev.map((p) =>
				p.id === phId
					? {
							...p,
							invoices: p.invoices.map((i) =>
								i.id === invId ? { ...i, ...updated } : i,
							),
						}
					: p,
			),
		);
	}

	async function settleInvoice(phId: number, invId: number) {
		await api.updateInvoice(invId, { settled: true });
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

	async function deleteInvoice(phId: number, invId: number) {
		await api.deleteInvoice(invId);
		setPharmacies((prev) =>
			prev.map((p) =>
				p.id === phId ? { ...p, invoices: p.invoices.filter((i) => i.id !== invId) } : p,
			),
		);
	}

	// ── Render ────────────────────────────────────────────
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

			<FilterBar filter={filter} onChange={setFilter} />

			{loading ? (
				<div className="text-center py-16 text-muted-foreground">
					<i className="ti ti-loader-2 animate-spin text-3xl block mb-2" />
					<p className="text-sm">در حال بارگذاری...</p>
				</div>
			) : (
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
			)}

			{showAddModal && (
				<PharmacyModal
					onClose={() => setShowAddModal(false)}
					onSave={async (data) => {
						await addPharmacy(data);
						setShowAddModal(false);
					}}
				/>
			)}
		</main>
	);
}
