import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.title}>
        <h1 className={styles.concealed}>concealed<span className={styles.dotCards}>.cards</span></h1>
        <h2>The future of deck building.</h2>
      </div>
      <div className={styles.card}>
          <h2>
            Coming soon.
          </h2>
          <p>Get it? Concealed cards. Like the ability? Haha</p>
          <p>Stay tuned. Follow @jgrimesey.</p>
      </div>
      <div className={styles.card}>
        <h2>
            Stuff to put in API docs:
          </h2>
          <p>User decks have 10 digit IDs. Temp decks have 11 digit IDs.</p>
      </div>
    </main>
  )
}
