import styles from '../styles/sample.module.css'
import React from 'react'

interface Props {
    children: React.ReactNode
}

const SampleLayout: React.FunctionComponent<Props> = ({ children }) => {
	return (
		<div className={styles.center}>
			{children}
		</div>
	)
}

export default SampleLayout
