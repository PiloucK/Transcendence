import type { ReactElement } from 'react'
import MainLayout from '../layouts/mainLayout'
// import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Card from '../tools/cards'

export default function Login() {
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

Login.getLayout = function getLayout(login: ReactElement) {
  return (
    <MainLayout>
      {login}
    </MainLayout>
  )
}
