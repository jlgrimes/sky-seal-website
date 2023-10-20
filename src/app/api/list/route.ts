import { NextRequest, NextResponse } from 'next/server';
import { convertListToCards, getDeckCount, normalizeDeckList } from '../_helpers';

export async function GET(request: NextRequest) {
  const cardsParam = request.nextUrl.searchParams.get('cards');

  if (!cardsParam || cardsParam.length === 0) {
    return NextResponse.json({
      error: 'incorrect-query-params',
      message: 'Incorrect query parameters.',
      details: 'Missing cards param.',
      hint: 'Send in cards in a comma-delimited list like this: concealed.cards/api/list?cards=1 Charizard ex OBF 223'
    }, { status: 400 });
  }

  try {
    const { normalizedList, invalidLines: invalidNormalizedLines }  = normalizeDeckList(cardsParam.split(',').join('\n'))
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