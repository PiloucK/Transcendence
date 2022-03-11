import type { ReactElement } from 'react'
import MainLayout from '../layouts/mainLayout'
// import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Chat() {
  return (
    <div className={styles.grid}>
        <Link href='/'>
        <a className={styles.card}>
        <h2>Documentation &rarr;</h2>
        <p>Find in-depth information about Next.js features and API.</p>
        </a>
        </Link>
    </div>
  )
}

Chat.getLayout = function getLayout(chat: ReactElement) {
  return (
    <MainLayout>
      {chat}
    </MainLayout>
  )
}
