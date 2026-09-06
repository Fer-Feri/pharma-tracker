'use client';

import { useState } from 'react';

import type { Invoice, Pharmacy } from '@/types';
import { getPharmacyStatus } from '@/lib/status';

import InvoiceRow from './InvoiceRow';
import PharmacyModal from './modals/PharmacyModal';
import InvoiceModal from './modals/InvoiceModal';
import ConfirmDialog from './ConfirmDialog';

interface Props {
	pharmacy: Pharmacy;
	onUpdate: (data: { name: string; phone: string }) => void;
	onDelete: () => void;
	onAddInvoice: (data: { date: string; amount: number; period: 1 | 3; notes: string }) => void;
	onUpdateInvoice: (invId: number, data: Partial<Invoice>) => void;
	onSettleInvoice: (invId: number) => void;
	onDeleteInvoice: (invId: number) => void;
}

const statusBorder = {
	red: 'border-r-[3px] border-r-danger-text',
	yellow: 'border-r-[3px] border-r-warning-text',
	green: 'border-r-[3px] border-r-success-text',
};

const statusDot = {
	red: 'bg-danger-text',
	yellow: 'bg-warning-text',
	green: 'bg-success-text',
};

const statusLabel = {
	red: { text: 'فوری', color: 'text-danger-text' },
	yellow: { text: 'نزدیک', color: 'text-warning-text' },
	green: { text: 'عادی', color: 'text-success-text' },
};

export default function PharmacyCard({
	pharmacy,
	onUpdate,
	onDelete,
	onAddInvoice,
	onUpdateInvoice,
	onSettleInvoice,
	onDeleteInvoice,
}: Props) {
	const [expanded, setExpanded] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showAddInvoice, setShowAddInvoice] = useState(false);
	const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

	const [confirmDelete, setConfirmDelete] = useState(false);
	const [settleTarget, setSettleTarget] = useState<Invoice | null>(null);
	const [deleteInvoiceTarget, setDeleteInvoiceTarget] = useState<Invoice | null>(null);

	const st = getPharmacyStatus(pharmacy);

	const activeInvoices = pharmacy.invoices.filter((i) => !i.settled);
	const settledInvoices = pharmacy.invoices.filter((i) => i.settled);

	return (
		<>
			<div
				className={`bg-card rounded-xl border border-border ${statusBorder[st]} px-4 py-3 cursor-pointer hover:border-gray-300 transition-colors`}
				onClick={() => setExpanded((v) => !v)}>
				{/* Top row */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<span className={`w-2 h-2 rounded-full shrink-0 ${statusDot[st]}`} />

						<span className="text-sm font-medium flex items-center gap-1.5">
							<i
								className={`ti ${
									pharmacy.type === 'health' ? 'ti-heart-rate-monitor' : 'ti-pill'
								} text-muted-foreground text-sm`}
							/>

							{pharmacy.name}
						</span>
					</div>

					<div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
						{pharmacy.phone && (
							<a
								href={`tel:${pharmacy.phone}`}
								className="text-primary text-base hover:opacity-70 transition-opacity"
								title="تماس">
								<i className="ti ti-phone" />
							</a>
						)}

						<button
							onClick={() => setShowEditModal(true)}
							className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground hover:text-foreground text-sm transition-colors">
							<i className="ti ti-edit" />
						</button>

						<button
							onClick={() => setConfirmDelete(true)}
							className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground hover:bg-danger-bg hover:text-danger-text hover:border-danger-border text-sm transition-colors">
							<i className="ti ti-trash" />
						</button>
					</div>
				</div>

				{/* Meta row */}
				<div className="flex items-center gap-2 mt-2 flex-wrap">
					<span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
						<i className="ti ti-file-invoice text-xs" />
						{activeInvoices.length} فاکتور فعال
					</span>

					{pharmacy.phone && (
						<span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
							<i className="ti ti-phone text-xs" />
							{pharmacy.phone}
						</span>
					)}

					<span
						className={`flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full border border-border ${statusLabel[st].color}`}>
						<span className={`w-1.5 h-1.5 rounded-full ${statusDot[st]}`} />
						{statusLabel[st].text}
					</span>

					<span className="mr-auto text-muted-foreground text-xs">
						<i className={`ti ti-chevron-${expanded ? 'up' : 'down'}`} />
					</span>
				</div>

				{/* Invoices */}
				{expanded && (
					<div
						className="mt-3 pt-3 border-t border-border"
						onClick={(e) => e.stopPropagation()}>
						<div className="flex items-center justify-between mb-2">
							<span className="text-xs text-muted-foreground font-medium">
								فاکتورهای فعال ({activeInvoices.length})
							</span>

							<button
								onClick={() => setShowAddInvoice(true)}
								className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-border bg-muted hover:bg-gray-200 transition-colors">
								<i className="ti ti-plus text-xs" />
								فاکتور جدید
							</button>
						</div>

						<div className="flex flex-col gap-2">
							{activeInvoices.map((inv) => (
								<InvoiceRow
									key={inv.id}
									invoice={inv}
									onSettle={() => setSettleTarget(inv)}
									onEdit={() => setEditingInvoice(inv)}
									onDelete={() => setDeleteInvoiceTarget(inv)}
								/>
							))}
						</div>

						{settledInvoices.length > 0 && (
							<div className="mt-3">
								<p className="text-xs text-muted-foreground font-medium mb-2">
									تسویه‌شده ({settledInvoices.length})
								</p>

								<div className="flex flex-col gap-2">
									{settledInvoices.map((inv) => (
										<InvoiceRow
											key={inv.id}
											invoice={inv}
											onSettle={() => {}}
											onEdit={() => {}}
											onDelete={() => setDeleteInvoiceTarget(inv)}
											settled
										/>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Modals */}

			{showEditModal && (
				<PharmacyModal
					initial={{
						name: pharmacy.name,
						phone: pharmacy.phone,
						type: pharmacy.type,
					}}
					onClose={() => setShowEditModal(false)}
					onSave={(data) => {
						onUpdate(data);
						setShowEditModal(false);
					}}
				/>
			)}

			{showAddInvoice && (
				<InvoiceModal
					onClose={() => setShowAddInvoice(false)}
					onSave={(data) => {
						onAddInvoice(data);
						setShowAddInvoice(false);
					}}
				/>
			)}

			{editingInvoice && (
				<InvoiceModal
					initial={editingInvoice}
					onClose={() => setEditingInvoice(null)}
					onSave={(data) => {
						onUpdateInvoice(editingInvoice.id, data);
						setEditingInvoice(null);
					}}
				/>
			)}

			{/* Confirm Dialogs */}

			<ConfirmDialog
				open={confirmDelete}
				title="حذف داروخانه"
				description={`آیا از حذف "${pharmacy.name}" مطمئنی؟ تمام فاکتورها هم حذف می‌شن.`}
				confirmLabel="حذف"
				confirmClass="bg-danger-text text-white"
				onConfirm={() => {
					setConfirmDelete(false);
					onDelete();
				}}
				onCancel={() => setConfirmDelete(false)}
			/>

			<ConfirmDialog
				open={!!settleTarget}
				title="تسویه فاکتور"
				description="فاکتور تسویه شد؟ بعد از تأیید دیگه قابل برگشت نیست."
				confirmLabel="بله، تسویه شد"
				confirmClass="bg-success-text text-white"
				onConfirm={() => {
					if (settleTarget) {
						onSettleInvoice(settleTarget.id);
					}

					setSettleTarget(null);
				}}
				onCancel={() => setSettleTarget(null)}
			/>

			<ConfirmDialog
				open={!!deleteInvoiceTarget}
				title="حذف فاکتور"
				description="این فاکتور حذف شود؟"
				confirmLabel="حذف"
				confirmClass="bg-danger-text text-white"
				onConfirm={() => {
					if (deleteInvoiceTarget) {
						onDeleteInvoice(deleteInvoiceTarget.id);
					}

					setDeleteInvoiceTarget(null);
				}}
				onCancel={() => setDeleteInvoiceTarget(null)}
			/>
		</>
	);
}
