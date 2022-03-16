import Link from 'next/link'
import React from 'react'
import styles from '../styles/Home.module.css'

export default class dynamicTest extends React.Component
{
	constructor(props:any)
	{
		super(props);
		this.state = {
			nb: 0,
		};
	}

	render()
	{
		const title = <h2> {this.props.title} </h2>;
		return (
				<button
					className={styles.card}
					onClick={() => this.setState({nb: this.state.nb + 1})}
				>
						{title}
					<p> {this.state.nb} </p>
				</button>
		);
	}
}
