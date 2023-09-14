import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { convertListToCodes, normalizeDeckList } from '../_helpers';
import { BASE_URL } from '../_const';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url);
  const deckId = searchParams.get('id');

  if (!deckId) return NextResponse.json({
    error: 'incorrect-query-params',
    message: 'Incorrect query parameters.',
    details: 'Ensure you are passing in the param for id.'
  }, { status: 400 });

  if (deckId.length !== 10) return NextResponse.json({
    error: 'incorrect-query-params',
    message: 'Incorrect query parameters.',
    details: 'Deck id must have a length of 10.'
  }, { status: 400 });

  const deck = await supabase.from('frozen decks').select('deck_list').eq('id', deckId);

  if (deck.error) return NextResponse.json({
    error: 'database-error',
    message: deck.error.message,
    details: deck.error.details
  }, { status: 400 });

  if (deck.data && deck.data.length === 0) return NextResponse.json({
    error: 'deck-not-found',
    message: 'Deck not found.',
    details: 'No deck found with that id.'
  }, { status: 400 });

  return NextResponse.json({
    list: deck.data[0].deck_list
  });
}
 
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const body: string = await request.text();

  try {
    const { cards, invalidLines } = await convertListToCodes(normalizeDeckList(body));
    const existingDeck = await supabase.from('frozen decks').select('id').eq('deck_list', JSON.stringify(cards));

    if (existingDeck.data && existingDeck.data.length > 0) {
      const id = existingDeck.data[0].id;
      return NextResponse.json({
        id,
        url: `${BASE_URL}/${id}`
      });
    }
  

    const numberOfCards = cards.reduce((acc: number, curr: { code: string, count: number }) => {
      return acc + curr.count;
    }, 0);

    if (numberOfCards < 60) {
      throw {
        error: 'invalid-deck',
        details: `Deck sent only has ${numberOfCards} cards. Needs to have 60 cards. Please check to make sure all lines are valid.`,
        invalidLines
      }
    }

    const createdDeck = await supabase.from('frozen decks').insert({ deck_list: JSON.stringify(cards) }).select('id');
    const id = createdDeck.data?.[0].id;

    return NextResponse.json({
      id,
      url: `${BASE_URL}/${id}`,
      invalidLines
    });
  } catch (e) {
    return NextResponse.json(e, { status: 400 });
  }
}