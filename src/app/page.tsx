import { DeckViewer } from './_components/DeckViewer/DeckViewer'
import styles from './page.module.css'

export default function Home({ params }: { params: { slug: string | undefined } }) {
  if (params.slug && params.slug.length > 0) {
    return <DeckViewer deckId={params.slug.trim()} />
  }

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        <h1 className={styles.concealed}>concealed<span className={styles.dotCards}>.cards</span></h1>
        <h2>The future of deck building.</h2>
      </div>
      <div className={styles.grid}>
      <div className={styles.card}>
          <h2>
            Never forget another card count.
          </h2>
          <p>Tired of always sifting through your photo gallery and Facebook Messenger for deck lists? Introducing Concealed - a lightning fast mobile app that manages decks for the Pokémon Trading Card Game.</p>
      </div>
      <div className={styles.card}>
          <h2>
            PTCG Live&apos;s best friend.
          </h2>
          <p>Concealed lets you continue the excitement of the Pokémon TCG into the battle ring with Pokémon TCG Live. Export any deck made on Concealed to a Pokémon TCG Live compatible list with just a tap.</p>
      </div>
      <div className={styles.card}>
          <h2>
            Share decks with one tap.
          </h2>
          <p>Sharing a deck list has never been easier. With Concealed, you can share your decks in person with just a QR code. For sharing online, you can export your entire deck through a single link.</p>
      </div>
      <div className={styles.card}>
        <h2>
            Developer friendly.
          </h2>
          <p>Give your users the best deck viewing experience with Concealed through our public API. Send us a deck list, we&apos;ll send you a deep link to view it in Concealed. It&apos;s that easy.</p>
      </div>
      </div>
      <div className={styles.comingSoon}>
          <h2>
            Coming soon.
          </h2>
          <p>Follow <a target="_blank" rel="noopener noreferrer" href="https://x.com/jgrimesey">@jgrimesey</a> for updates.</p>
      </div>
    </main>
  )
}
