'use client';

import * as Dialog from '@radix-ui/react-dialog';

interface Props {
	open: boolean;
	title: string;
	description: string;
	confirmLabel?: string;
	confirmClass?: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export default function ConfirmDialog({
	open,
	title,
	description,
	confirmLabel = 'تأیید',
	confirmClass = 'bg-primary text-white',
	onConfirm,
	onCancel,
}: Props) {
	return (
		<Dialog.Root open={open} onOpenChange={(v) => !v && onCancel()}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
				<Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-card border border-border rounded-2xl p-6 w-full max-w-xs shadow-lg">
					<Dialog.Title className="text-sm font-medium mb-2">{title}</Dialog.Title>
					<Dialog.Description className="text-xs text-muted-foreground mb-6">
						{description}
					</Dialog.Description>
					<div className="flex gap-2">
						<button
							onClick={onCancel}
							className="flex-1 py-2 rounded-lg border border-border bg-muted text-sm hover:bg-gray-200 transition-colors">
							انصراف
						</button>
						<button
							onClick={onConfirm}
							className={`flex-1 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity ${confirmClass}`}>
							{confirmLabel}
						</button>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
