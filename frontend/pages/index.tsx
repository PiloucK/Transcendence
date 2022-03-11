import Link from 'next/link'
import type { ReactElement } from 'react'
import MainLayout from '../layouts/mainLayout'
// import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'

export default function Page() {
  return (
    <div className={styles.grid}>
        <Link href='/toto'>
          <a className={styles.card}>
          <h2>Documentation &rarr;</h2>
          <p>Find in-depth information about Next.js features and API.</p>
          </a>
        </Link>

        <a className={styles.card}>
        <h2>Learn &rarr;</h2>
        <p>Learn about Next.js in an interactive course with quizzes!</p>
        </a>

        <a
        className={styles.card}
        >
        <h2>Examples &rarr;</h2>
        <p>Discover and deploy boilerplate example Next.js projects.</p>
        </a>

        <a
        className={styles.card}
        >
        <h2>Deploy &rarr;</h2>
        <p>
            Instantly deploy your Next.js site to a public URL with Vercel.
        </p>
        </a>
    </div>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}
