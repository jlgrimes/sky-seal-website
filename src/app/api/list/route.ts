import { NextResponse } from 'next/server';
import { convertListToCodes, normalizeDeckList } from '../_helpers';

export async function POST(request: Request) {
  const body: string = await request.text();

  try {
    const { cards, invalidLines } = await convertListToCodes(normalizeDeckList(body));

    return NextResponse.json({
      cards,
      invalidLines
    });

  } catch (e) {
    return NextResponse.json(e, { status: 400 });
  }
}