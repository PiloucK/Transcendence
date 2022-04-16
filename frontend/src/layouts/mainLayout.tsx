import styles from '../styles/Home.module.css'
import React from "react";

interface Props {
    children: React.ReactNode
}

const MainLayout: React.FunctionComponent<Props> = ({ children }) => {
	
    return (
		<>
			{children}
		</>
    )
}

export default MainLayout
