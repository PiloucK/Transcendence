import styles from '../styles/Home.module.css'
import React from 'react'

interface Props {
    children: React.ReactNode
}

const DefaultLayout: React.FunctionComponent<Props> = ({ children }) => {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to <a>Next.js!</a>
                </h1>
        
                <p className={styles.description}>
                    Get started by editing{' '}
                    <code className={styles.code}>pages/index.tsx</code>
                </p>

                {children}
            </main>
        </div>
    )
}

export default DefaultLayout
