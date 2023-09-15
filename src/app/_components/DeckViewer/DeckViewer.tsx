import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface DeckViewerProps {
  deckId: string;
}

function getTargetTable(deckId: string) {
  if (deckId.length === 10) return 'decks';
  if (deckId.length === 11) return 'frozen decks';

  return null;
}

export async function DeckViewer(props: DeckViewerProps) {
  const supabase = createServerComponentClient({ cookies });
  const targetTable = getTargetTable(props.deckId)

  if (!targetTable) {
    // TODO: Oopsies! No deck with that ID!
    return null;
  }

  const foundDeckRes = await supabase.from(targetTable).select('*');

  if (!foundDeckRes.data || foundDeckRes.data.length === 0) {
    // TODO: Oopsies! No deck with that ID!
    return null;
  }

  const deck: Record<string, any> = foundDeckRes.data[0];

  let cards: { code: string, count: number }[] = [];
  if (deck['deck_list']) {
    cards = JSON.parse(deck['deck_list']);
  } else {
    // Else, it's a user saved deck list and we need to fetch it
    const cardsRes = await supabase.from('cards').select('code,count').eq('id', deck['id']).returns<{ code: string, count: number }[]>();
    cards = cardsRes.data ?? [];
  }

  return <div>
    {JSON.stringify(cards)}
  </div>
}