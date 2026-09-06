import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'پیگیری حساب‌ها',
	description: 'مدیریت فاکتورهای داروخانه‌ها و مراکز بهداشتی',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="fa" dir="rtl">
			<head>
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
				/>
			</head>
			<body>{children}</body>
		</html>
	);
}
