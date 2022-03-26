import Link from 'next/link'
import React from 'react'
import styles from '../../styles/Home.module.css'

export default function ButtonIncrement(props:any)
{
	const [nbr, setNbr] = React.useState(0);

	return (
		<button
			className={styles.card}
			onClick={() => setNbr(nbr + 1)}
		>
			{props.title ? <h2> {props.title} </h2> : null}
			{nbr}
		</button>
	);
}
