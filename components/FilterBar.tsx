'use client';
import type { FilterType } from '@/types';

interface Props {
	filter: FilterType;
	onChange: (f: FilterType) => void;
}

const filters: { key: FilterType; label: string; dot?: string }[] = [
	{ key: 'all', label: 'همه' },
	{ key: 'red', label: 'فوری', dot: 'bg-danger-text' },
	{ key: 'yellow', label: 'نزدیک', dot: 'bg-warning-text' },
	{ key: 'green', label: 'عادی', dot: 'bg-success-text' },
];

export default function FilterBar({ filter, onChange }: Props) {
	return (
		<div className="flex items-center gap-2 mb-4 flex-wrap">
			<span className="text-sm text-muted-foreground">نمایش:</span>
			{filters.map((f) => (
				<button
					key={f.key}
					onClick={() => onChange(f.key)}
					className={`
            flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all
            ${f.key === 'all' ? 'bg-muted text-foreground border-border' : ''}
            ${f.key === 'red' ? 'bg-danger-bg text-danger-text border-danger-border' : ''}
            ${f.key === 'yellow' ? 'bg-warning-bg text-warning-text border-warning-border' : ''}
            ${f.key === 'green' ? 'bg-success-bg text-success-text border-success-border' : ''}
            ${filter === f.key ? 'ring-2 ring-offset-1 ring-border' : 'opacity-70 hover:opacity-100'}
          `}>
					{f.dot && <span className={`w-1.5 h-1.5 rounded-full ${f.dot}`} />}
					{f.label}
				</button>
			))}
		</div>
	);
}
