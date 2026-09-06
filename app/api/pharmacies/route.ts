import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializePharmacy } from '@/lib/serialize';

export async function GET() {
	const pharmacies = await prisma.pharmacy.findMany({
		include: { invoices: { orderBy: { date: 'asc' } } },
		orderBy: { createdAt: 'asc' },
	});
	return NextResponse.json(pharmacies.map(serializePharmacy));
}

export async function POST(req: Request) {
	const body = await req.json();
	const pharmacy = await prisma.pharmacy.create({
		data: {
			name: body.name,
			phone: body.phone ?? '',
			type: body.type ?? 'pharmacy',
		},
	});
	return NextResponse.json(serializePharmacy({ ...pharmacy, invoices: [] }), { status: 201 });
}
