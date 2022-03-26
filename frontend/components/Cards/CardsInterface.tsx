import Link from 'next/link'
import styles from '../../styles/Home.module.css'

export default function Card(props:any)
{
	return (
		<Link href={props.href}>
			<div className={styles.card}>
				{props.title ? <h2> {props.title} </h2> : null}
				{props.content ? <p> {props.content} </p> : null}
			</div>
		</Link>
	)
}
