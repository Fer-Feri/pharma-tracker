'use client';

import { useState } from 'react';
import type { PharmacyType } from '@/types';

interface Props {
	initial?: { name: string; phone: string; type: PharmacyType };
	onClose: () => void;
	onSave: (data: { name: string; phone: string; type: PharmacyType }) => void;
}

export default function PharmacyModal({ initial, onClose, onSave }: Props) {
	const [name, setName] = useState(initial?.name ?? '');
	const [phone, setPhone] = useState(initial?.phone ?? '');
	const [type, setType] = useState<PharmacyType>(initial?.type ?? 'pharmacy');
	const [error, setError] = useState('');

	function handleSave() {
		if (!name.trim()) {
			setError('نام الزامی است');
			return;
		}
		onSave({ name: name.trim(), phone: phone.trim(), type });
	}

	const isEdit = !!initial;

	return (
		<div
			className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}>
			<div className="bg-card rounded-2xl border border-border w-full max-w-sm p-6">
				<h2 className="text-base font-medium mb-5 flex items-center gap-2">
					<i className={`ti ${isEdit ? 'ti-edit' : 'ti-building-store'} text-primary`} />
					{isEdit ? 'ویرایش داروخانه' : 'داروخانه / مرکز جدید'}
				</h2>

				<div className="mb-4">
					<label className="block text-xs text-muted-foreground mb-1.5">نام</label>
					<input
						className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
						placeholder="مثلاً داروخانه بهاری"
						value={name}
						onChange={(e) => {
							setName(e.target.value);
							setError('');
						}}
					/>
					{error && <p className="text-xs text-danger-text mt-1">{error}</p>}
				</div>

				<div className="mb-4">
					<label className="block text-xs text-muted-foreground mb-1.5">شماره تماس</label>
					<input
						className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
						placeholder="09..."
						type="tel"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
					/>
				</div>

				<div className="mb-6">
					<label className="block text-xs text-muted-foreground mb-1.5">نوع</label>
					<div className="flex gap-2">
						{(['pharmacy', 'health'] as PharmacyType[]).map((t) => (
							<button
								key={t}
								onClick={() => setType(t)}
								className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-sm transition-all ${
									type === t
										? 'border-primary bg-primary/10 text-primary font-medium'
										: 'border-border bg-muted text-muted-foreground'
								}`}>
								<i
									className={`ti ${t === 'pharmacy' ? 'ti-pill' : 'ti-heart-rate-monitor'} text-sm`}
								/>
								{t === 'pharmacy' ? 'داروخانه' : 'مرکز بهداشتی'}
							</button>
						))}
					</div>
				</div>

				<div className="flex gap-2">
					<button
						onClick={onClose}
						className="flex-1 py-2 rounded-lg border border-border bg-muted text-sm hover:bg-gray-200 transition-colors">
						انصراف
					</button>
					<button
						onClick={handleSave}
						className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
						{isEdit ? 'ذخیره' : 'ایجاد'}
					</button>
				</div>
			</div>
		</div>
	);
}
