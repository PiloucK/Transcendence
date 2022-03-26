import type { ReactElement } from 'react'
import MainLayout from '../layouts/mainLayout'
// import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Card from '../components/Cards/CardsInterface'

export default function Chat() {
  return (
    <div className={styles.grid}>
      <Card
	href = '/'
	title = 'Home &rarr;'
	content = 'Go back to Home'
      />
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
