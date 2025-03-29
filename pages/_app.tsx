import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';

export default function App({ Component, pageProps }: AppProps) {
    const [documentsList, setDocumentsList] = useState<string[]>([]);

    useEffect(() => {
        // In a real app, you'd fetch this from an API
        // For this example, we'll hardcode or use the list from props
        if (pageProps.allDocs) {
            setDocumentsList(pageProps.allDocs);
        } else {
            // This is a placeholder. In production, you should fetch the list from an API
            setDocumentsList(['getting-started.md', 'features.md', 'api-reference.md']);
        }
    }, [pageProps.allDocs]);

    return (
        <Layout documentsList={documentsList}>
            <Component {...pageProps} />
        </Layout>
    );
}
