import type { Invoice } from '@/types';
import { getDaysLeft, formatAmount, daysText, getInvoiceStatus } from '@/lib/status';
import { gregorianToJalali } from '@/lib/jalali';

interface Props {
	invoice: Invoice;
	onSettle: () => void;
	onEdit: () => void;
	onDelete: () => void;
	settled?: boolean;
}

const rowStyle = {
	red: 'border-danger-border bg-danger-bg',
	yellow: 'border-warning-border bg-warning-bg',
	green: 'border-border bg-muted',
	settled: 'border-border bg-muted opacity-50',
};

const daysColor = {
	red: 'text-danger-text',
	yellow: 'text-warning-text',
	green: 'text-muted-foreground',
	settled: 'text-muted-foreground',
};

export default function InvoiceRow({ invoice, onSettle, onEdit, onDelete, settled }: Props) {
	const st = settled ? 'settled' : getInvoiceStatus(invoice);
	const days = getDaysLeft(invoice.date, invoice.period);

	return (
		<div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border ${rowStyle[st]}`}>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 flex-wrap">
					<span className="text-xs font-medium">{gregorianToJalali(invoice.date)}</span>
					<span
						className={`text-xs px-2 py-0.5 rounded-full ${invoice.period === 1 ? 'bg-success-bg text-success-text' : 'bg-primary/10 text-primary'}`}>
						{invoice.period === 1 ? 'یک ماهه' : 'سه ماهه'}
					</span>
					{!settled && (
						<span className={`text-xs font-medium ${daysColor[st]}`}>
							{daysText(days)}
						</span>
					)}
				</div>
				<p className="text-xs text-muted-foreground mt-0.5">
					{formatAmount(invoice.amount)}
				</p>
				{invoice.notes && (
					<p className="text-xs text-muted-foreground mt-0.5 italic">{invoice.notes}</p>
				)}
			</div>

			{!settled && (
				<div className="flex items-center gap-1.5 shrink-0">
					<button
						onClick={onSettle}
						title="تسویه شد"
						className="w-6 h-6 flex items-center justify-center rounded-lg border border-success-border bg-success-bg text-success-text hover:bg-[#1a7f4b] hover:text-white text-xs transition-colors">
						<i className="ti ti-check" />
					</button>
					<button
						onClick={onEdit}
						className="w-6 h-6 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground text-xs transition-colors">
						<i className="ti ti-edit" />
					</button>
				</div>
			)}

			<button
				onClick={onDelete}
				className="w-6 h-6 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-danger-bg hover:text-danger-text hover:border-danger-border text-xs transition-colors shrink-0">
				<i className="ti ti-trash" />
			</button>
		</div>
	);
}
