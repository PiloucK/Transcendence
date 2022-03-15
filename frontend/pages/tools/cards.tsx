import Link from 'next/link'
import styles from '../../styles/Home.module.css'

export default function cards(props)
{
  return (
    <Link href={props.href}>
      <a className={styles.card}>
	<h2> {props.title} </h2>
	<p> {props.content} </p>
      </a>
    </Link>
  )
}
