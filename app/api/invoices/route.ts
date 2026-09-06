import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeInvoice } from '@/lib/serialize';

export async function POST(req: Request) {
	const body = await req.json();
	const invoice = await prisma.invoice.create({
		data: {
			pharmacyId: body.pharmacyId,
			date: new Date(body.date),
			amount: body.amount,
			period: body.period,
			notes: body.notes ?? '',
		},
	});
	return NextResponse.json(serializeInvoice(invoice), { status: 201 });
}
