// import testHeader from './testHeader'
// import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import React from 'react'

interface Props {
    children: React.ReactNode
}

const MainLayout: React.FunctionComponent<Props> = ({ children }) => {
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

                {/* <TestHeader /> */}
                {children}
            </main>
        </div>
    )
}

// const Home: React.FunctionComponent = () => {
//     return (
//         <MainLayout>
//             <div className={styles.container}>
//                 <section>
//                     <div className={styles.grid}>
//                         <a className={styles.card}>
//                         <h2>Documentation &rarr;</h2>
//                         <p>Find in-depth information about Next.js features and API.</p>
//                         </a>

//                         <a className={styles.card}>
//                         <h2>Learn &rarr;</h2>
//                         <p>Learn about Next.js in an interactive course with quizzes!</p>
//                         </a>

//                         <a
//                         className={styles.card}
//                         >
//                         <h2>Examples &rarr;</h2>
//                         <p>Discover and deploy boilerplate example Next.js projects.</p>
//                         </a>

//                         <a
//                         className={styles.card}
//                         >
//                         <h2>Deploy &rarr;</h2>
//                         <p>
//                             Instantly deploy your Next.js site to a public URL with Vercel.
//                         </p>
//                         </a>
//                     </div>
//                 </section>
//             </div>
//         </MainLayout>
//     )
// }

export default MainLayout
