import type { Pharmacy, FilterType, Invoice } from '@/types';
import { getPharmacyStatus } from '@/lib/status';
import PharmacyCard from './PharmacyCard';

interface Props {
	pharmacies: Pharmacy[];
	filter: FilterType;
	onUpdatePharmacy: (id: number, data: { name: string; phone: string }) => void;
	onDeletePharmacy: (id: number) => void;
	onAddInvoice: (
		phId: number,
		data: { date: string; amount: number; period: 1 | 3; notes: string },
	) => void;
	onUpdateInvoice: (phId: number, invId: number, data: Partial<Invoice>) => void;
	onSettleInvoice: (phId: number, invId: number) => void;
	onDeleteInvoice: (phId: number, invId: number) => void;
}

export default function PharmacyList({
	pharmacies,
	filter,
	onUpdatePharmacy,
	onDeletePharmacy,
	onAddInvoice,
	onUpdateInvoice,
	onSettleInvoice,
	onDeleteInvoice,
}: Props) {
	const sorted = [...pharmacies]
		.sort((a, b) => {
			const order = { red: 0, yellow: 1, green: 2 };
			return order[getPharmacyStatus(a)] - order[getPharmacyStatus(b)];
		})
		.filter((p) => filter === 'all' || getPharmacyStatus(p) === filter);

	if (sorted.length === 0) {
		return (
			<div className="text-center py-16 text-muted-foreground">
				<i className="ti ti-building-store text-5xl block mb-3 opacity-30" />
				<p className="text-sm">موردی یافت نشد</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{sorted.map((ph) => (
				<PharmacyCard
					key={ph.id}
					pharmacy={ph}
					onUpdate={(data) => onUpdatePharmacy(ph.id, data)}
					onDelete={() => onDeletePharmacy(ph.id)}
					onAddInvoice={(data) => onAddInvoice(ph.id, data)}
					onUpdateInvoice={(invId, data) => onUpdateInvoice(ph.id, invId, data)}
					onSettleInvoice={(invId) => onSettleInvoice(ph.id, invId)}
					onDeleteInvoice={(invId) => onDeleteInvoice(ph.id, invId)}
				/>
			))}
		</div>
	);
}
