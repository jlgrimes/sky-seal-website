import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h2>
            Nothing here... yet
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
