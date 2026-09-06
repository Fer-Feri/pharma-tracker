import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const body = await req.json();
	const pharmacy = await prisma.pharmacy.update({
		where: { id: Number(id) },
		data: {
			name: body.name,
			phone: body.phone,
		},
	});
	return NextResponse.json(pharmacy);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	await prisma.pharmacy.delete({ where: { id: Number(id) } });
	return NextResponse.json({ ok: true });
}
