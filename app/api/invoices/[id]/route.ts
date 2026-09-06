import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeInvoice } from '@/lib/serialize';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const body = await req.json();
	const invoice = await prisma.invoice.update({
		where: { id: Number(id) },
		data: {
			...(body.date && { date: new Date(body.date) }),
			...(body.amount !== undefined && { amount: body.amount }),
			...(body.period && { period: body.period }),
			...(body.notes !== undefined && { notes: body.notes }),
			...(body.settled !== undefined && { settled: body.settled }),
		},
	});
	return NextResponse.json(serializeInvoice(invoice));
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	await prisma.invoice.delete({ where: { id: Number(id) } });
	return NextResponse.json({ ok: true });
}
