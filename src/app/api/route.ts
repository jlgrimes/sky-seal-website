import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { normalizeDeckList } from './_helpers';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url);
  const deckId = searchParams.get('id');

  if (!deckId) return NextResponse.json({
    error: 'incorrect-query-params',
    message: 'Incorrect query parameters.',
    details: 'Ensure you are passing in the param for id.'
  }, { status: 400 });

  if (deckId.length !== 6) return NextResponse.json({
    error: 'incorrect-query-params',
    message: 'Incorrect query parameters.',
    details: 'Deck id must have a length of 6.'
  }, { status: 400 });

  const deck = await supabase.from('decks').select('frozen_list').eq('id', deckId);

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
    list: deck.data[0].frozen_list
  });
}
 
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const body: string = await request.text();
  const existingDeck = await supabase.from('decks').select('id').eq('frozen_list', normalizeDeckList(body));

  if (existingDeck.data && existingDeck.data.length > 0) {
    return NextResponse.json({
      id: existingDeck.data[0].id
    });
  }

  const createdDeck = await supabase.from('decks').insert({ frozen_list: normalizeDeckList(body) }).select('id');
 
  return NextResponse.json({
    id: createdDeck.data?.[0].id
  })
}