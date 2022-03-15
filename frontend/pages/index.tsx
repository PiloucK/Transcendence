import Link from 'next/link'
import type { ReactElement } from 'react'
import MainLayout from '../layouts/mainLayout'
// import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import Card from './tools/cards.tsx'

export default function Page() {
  return (
    <div className={styles.grid}>
        
	<Card
	  href = '/chat'
          title = 'Chat &rarr;'
          content = 'Access to the chat and discuss with everyone!'
        />

	<Card
	  href = '/login'
	  title = 'Login &rarr;'
	  content = 'This will guide you to the login page!'
	/>
	
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
