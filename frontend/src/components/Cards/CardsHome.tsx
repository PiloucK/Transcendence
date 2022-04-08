import Link from 'next/link'
import styles from '../../styles/Home.module.css'

export default function Card()
{
	return (
		<Link href='/'>
			<div className={styles.card}>
				<h2> HOME </h2>
			</div>
		</Link>
	)
}
