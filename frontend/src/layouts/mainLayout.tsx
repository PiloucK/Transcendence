import styles from '../styles/Home.module.css'
import React from "react";

interface Props {
    children: React.ReactNode
}


//Show a Big play button to start the game in the middle of the screen.
const MainLayout: React.FunctionComponent<Props> = ({ children }) => {
	
    return (
		<div className={styles.mainLayout}>
			<div className={styles.mainLayout_left_background}/>
			<div className={styles.mainLayout_right_background}/>
			<div className={styles.play}>
				PLAY
			</div>
			{children}
		</div>
    )
}

export default MainLayout
