'use client';

import { useState } from 'react';
import type { Invoice } from '@/types';

interface Props {
	initial?: Invoice;
	onClose: () => void;
	onSave: (data: { date: string; amount: number; period: 1 | 3; notes: string }) => void;
}

export default function InvoiceModal({ initial, onClose, onSave }: Props) {
	const [date, setDate] = useState(initial?.date ?? '');
	const [amount, setAmount] = useState(initial?.amount ? String(initial.amount) : '');
	const [period, setPeriod] = useState<1 | 3>(initial?.period ?? 1);
	const [notes, setNotes] = useState(initial?.notes ?? '');
	const [error, setError] = useState('');

	const isEdit = !!initial;

	function handleSave() {
		if (!date.trim()) {
			setError('تاریخ الزامی است');
			return;
		}
		onSave({ date: date.trim(), amount: Number(amount) || 0, period, notes: notes.trim() });
	}

	return (
		<div
			className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}>
			<div className="bg-card rounded-2xl border border-border w-full max-w-sm p-6">
				<h2 className="text-base font-medium mb-5 flex items-center gap-2">
					<i className={`ti ${isEdit ? 'ti-edit' : 'ti-file-invoice'} text-primary`} />
					{isEdit ? 'ویرایش فاکتور' : 'فاکتور جدید'}
				</h2>

				<div className="grid grid-cols-2 gap-3 mb-4">
					<div>
						<label className="block text-xs text-muted-foreground mb-1.5">تاریخ</label>
						<input
							className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
							placeholder="2025-09-01"
							type="date"
							value={date}
							onChange={(e) => {
								setDate(e.target.value);
								setError('');
							}}
						/>
						{error && <p className="text-xs text-danger-text mt-1">{error}</p>}
					</div>
					<div>
						<label className="block text-xs text-muted-foreground mb-1.5">
							مبلغ (ریال)
						</label>
						<input
							className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
							placeholder="8500000"
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
						/>
					</div>
				</div>

				<div className="mb-4">
					<label className="block text-xs text-muted-foreground mb-1.5">مدت تسویه</label>
					<div className="flex gap-2">
						{([1, 3] as const).map((p) => (
							<button
								key={p}
								onClick={() => setPeriod(p)}
								className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-sm transition-all ${
									period === p
										? 'border-primary bg-primary/10 text-primary font-medium'
										: 'border-border bg-muted text-muted-foreground'
								}`}>
								<i
									className={`ti ${p === 1 ? 'ti-cash' : 'ti-calendar-month'} text-sm`}
								/>
								{p === 1 ? 'یک ماهه' : 'سه ماهه'}
							</button>
						))}
					</div>
				</div>

				<div className="mb-6">
					<label className="block text-xs text-muted-foreground)] mb-1.5">توضیحات</label>
					<textarea
						className="w-full px-3 py-2 rounded-lg border border-border)] bg-muted)] text-sm focus:outline-none focus:border-primary)] focus:ring-2 focus:ring-primary)]/20 resize-none"
						placeholder="یادداشت اختیاری..."
						rows={2}
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
					/>
				</div>

				<div className="flex gap-2">
					<button
						onClick={onClose}
						className="flex-1 py-2 rounded-lg border border-border)] bg-muted)] text-sm hover:bg-gray-200 transition-colors">
						انصراف
					</button>
					<button
						onClick={handleSave}
						className="flex-1 py-2 rounded-lg bg-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity">
						{isEdit ? 'ذخیره' : 'ثبت فاکتور'}
					</button>
				</div>
			</div>
		</div>
	);
}
