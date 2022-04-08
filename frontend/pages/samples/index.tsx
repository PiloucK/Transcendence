import Link from 'next/link'
import { ReactElement } from 'react'
import SampleLayout from '../../src/layouts/samplesLayout'
// import type { NextPage } from 'next'
import styles from '../../styles/Home.module.css'

function getCards() {
	return (
		<>
			<h3>Cards</h3>
			<li>
				<Link href='samples/Cards/CardsInterface'>
					CardsInterface
				</Link>
			</li>
			<li>
				<Link href='samples/Cards/CardsHome'>
					CardsHome
				</Link>
			</li>
		</>
	)
}

function getButtons() {
	return (
		<>
			<h3>Buttons</h3>
			<li>
				<Link href='samples/Buttons/ButtonsInterface'>
					ButtonsInterface
				</Link>
			</li>
			<li>
				<Link href='samples/Buttons/ButtonsIncrement'>
					ButtonsIncrement
				</Link>
			</li>
		</>
	)
}

function getAnimation() {
	return (
		<>
			<h3>Animations</h3>
			<li>
				<Link href='samples/Animations/LinearTransition'>
					LinearTransition
				</Link>
			</li>
		</>
	)
}

export default function Page() {

	return (
		<div>
			<h1> Welcome to the sample page! </h1>

			<div className={styles.code}>
				{getCards()}

				{getButtons()}

				{getAnimation()}
			</div>
		</div>
	)
}

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <SampleLayout>
      {page}
    </SampleLayout>
  )
}
