import React from 'react';
import Sidebar from './Sidebar';
import { useRouter } from 'next/router';
import styles from './Layout.module.css';

type LayoutProps = {
    children: React.ReactNode;
    documentsList: string[];
};

const Layout: React.FC<LayoutProps> = ({ children, documentsList }) => {
    const router = useRouter();

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 onClick={() => router.push('/')} style={{ cursor: 'pointer', textAlign: 'left' }}>
                        AIML Cookbook
                    </h1>
                </div>
            </header>
            <div className={styles.container}>
                <Sidebar documentsList={documentsList} />
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
