import Link from 'next/link'
import React from 'react'
import styles from '../styles/Home.module.css'

export default function DynamicTest(props:any)
{
	return (
		<button
			className={styles.card}
			onClick={props.onClick}
		>
			<h2> {props.title} </h2>
			<p> {props.nb} </p>
		</button>
	);
}
