import { DeckViewer } from "../_components/DeckViewer/DeckViewer"

export default function Home({ params }: { params: { deckId: string | undefined } }) {
  if (params.deckId && params.deckId.length > 0) {
    return <DeckViewer deckId={params.deckId.trim()} />
  }

  return <div>Oopsies we cant find that deck</div>
}
