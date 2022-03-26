import Link from 'next/link'
import React from 'react'
import styles from '../../styles/Home.module.css'

export default function ButtonInterface(props:any)
{
	return (
		<button
			className={styles.card}
			onClick={props.onClick||function(){}}
		>
			{props.title ? <h2> {props.title} </h2> : null}
			{props.content ? <p> {props.content} </p> : null}
		</button>
	);
}
