import Link from 'next/link'
import { ReactElement, useState } from 'react'
import MainLayout from '../layouts/mainLayout'
// import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'

export default function Page() {

	return (
		<div className={styles.grid}>

			
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
