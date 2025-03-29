import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export default function Home({ allDocs }: { allDocs: string[] }) {
    return (
        <>
            <Head>
                <title>Documentation Home</title>
                <meta name="description" content="Documentation website" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div>
                <h1>Welcome to the Documentation</h1>
                <p>Select a document from the sidebar to view it.</p>

                <div style={{ marginTop: '2rem' }}>
                    <h2>Available Documents:</h2>
                    <ul>
                        {allDocs.map((doc) => {
                            const docName = doc.replace(/\.md$/, '');
                            return (
                                <li key={docName}>
                                    <Link href={`/docs/${docName}`}>{docName}</Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </>
    );
}

export async function getStaticProps() {
    // Get all .md files from the docs directory
    const docsDirectory = path.join(process.cwd(), 'docs');

    // Create docs directory if it doesn't exist
    if (!fs.existsSync(docsDirectory)) {
        fs.mkdirSync(docsDirectory, { recursive: true });

        // Create a sample markdown file for demo purposes
        const sampleContent = `# Getting Started\n\nThis is a sample markdown file to help you get started.\n\n## Introduction\n\nWrite your documentation in markdown files and they will be displayed on the website without reformatting.\n\n### Code Example\n\n\`\`\`javascript\nconst hello = 'world';\nconsole.log(hello);\n\`\`\`\n`;

        fs.writeFileSync(path.join(docsDirectory, 'getting-started.md'), sampleContent);
    }

    let filenames: string[] = [];
    try {
        filenames = fs.readdirSync(docsDirectory);
    } catch (error) {
        console.error('Error reading docs directory:', error);
    }

    const allDocs = filenames.filter(filename => filename.endsWith('.md'));

    return {
        props: {
            allDocs,
        },
    };
}
