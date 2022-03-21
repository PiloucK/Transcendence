import Link from 'next/link'
import { ReactElement, useState } from 'react'
import MainLayout from '../layouts/mainLayout'
// import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import Card from '../components/cards'
import Test from '../components/dynamicTest'

export default function Page() {
	const [nbr, setNbr] = useState(0);

	return (
		<div className={styles.grid}>

			<Test
				title = 'Press me'
				nb = {nbr}
				onClick = {() => setNbr(nbr + 1)}
			/>

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
