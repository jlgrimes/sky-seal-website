import { NextResponse } from 'next/server';
import { convertListToCards, getDeckCount, normalizeDeckList } from '../_helpers';

export async function POST(request: Request) {
  const body: string = await request.text();

  try {
    const { normalizedList, invalidLines: invalidNormalizedLines }  = normalizeDeckList(body)
    const { cards, invalidLines } = await convertListToCards(normalizedList);

    return NextResponse.json({
      count: getDeckCount(cards),
      cards,
      'not-parsed': [
        ...invalidNormalizedLines,
        ...invalidLines
      ]
    });

  } catch (e) {
    return NextResponse.json(e, { status: 400 });
  }
}