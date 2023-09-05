import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { normalizeDeckList } from './_helpers';
 
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const body: string = await request.text();
  const existingDeck = await supabase.from('decks').select('id').eq('frozen_list', normalizeDeckList(body));

  if (existingDeck.count && existingDeck.count > 0) {
    return NextResponse.json({
      id: existingDeck.data[0].id
    });
  }

  const createdDeck = await supabase.from('decks').insert({ frozen_list: normalizeDeckList(body) }).select('id');
 
  return NextResponse.json({
    id: createdDeck.data?.[0].id
  })
}