import styles from './DeckViewer.module.css';
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";

interface DeckViewerProps {
  deckId: string;
}

function getTargetTable(deckId: string) {
  if (deckId.length === 10) return 'decks';
  if (deckId.length === 11) return 'frozen decks';

  return null;
}

function buildImageUrl(deckId: string) {
  const [setCode, setNum] = deckId.split('-');

  if (setCode.toLowerCase() === 'swshp') {
    return `https://images.pokemontcg.io/${setCode}/SWSH${setNum}_hires.png`;
  }

  return `https://images.pokemontcg.io/${setCode}/${setNum}_hires.png`;
}

export async function DeckViewer(props: DeckViewerProps) {
  const supabase = createServerComponentClient({ cookies });
  const targetTable = getTargetTable(props.deckId)

  if (!targetTable) {
    // TODO: Oopsies! No deck with that ID!
    return null;
  }

  const foundDeckRes = await supabase.from(targetTable).select('*').eq('id', props.deckId);

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
    const cardsRes = await supabase.from('cards').select('code,count').eq('deck_id', deck['id']);
    cards = cardsRes.data ?? [];
  }

  return (
    <div>
      <div className={styles['card-layout']}>
        {cards.map((card) => (
          <div key={card.code} className={styles['card-view-container']}>
            <Image
              src={buildImageUrl(card.code)}
              alt={card.code}
              fill={true}
              objectFit='contain'
            />
          </div>
        ))}
      </div>
    </div>
  )
}