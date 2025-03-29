import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Sidebar.module.css';

interface SidebarProps {
    documentsList: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ documentsList }) => {
    const router = useRouter();
    const currentPath = router.query.slug || 'index';

    return (
        <nav className={styles.sidebar}>
            <div className={styles.sidebarInner}>
                <h2>Documents</h2>
                <ul>
                    <li className={currentPath === 'index' ? styles.active : ''}>
                        <Link href="/">Home</Link>
                    </li>
                    {documentsList.map((doc) => {
                        // Remove .md extension for display
                        const docName = doc.replace(/\.md$/, '');
                        return (
                            <li
                                key={docName}
                                className={currentPath === docName ? styles.active : ''}>
                                <Link href={`/docs/${docName}`}>{docName}</Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
};

export default Sidebar;
