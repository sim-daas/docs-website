import React from 'react';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface DocPageProps {
    content: string;
    title: string;
    allDocs: string[];
}

export default function DocPage({ content, title, allDocs }: DocPageProps) {
    return (
        <>
            <Head>
                <title>{title} - Documentation</title>
                <meta name="description" content={`Documentation for ${title}`} />
            </Head>

            <article>
                <ReactMarkdown
                    remarkPlugins={[gfm]}
                    rehypePlugins={[rehypeHighlight]}
                >
                    {content}
                </ReactMarkdown>
            </article>
        </>
    );
}

export async function getStaticPaths() {
    const docsDirectory = path.join(process.cwd(), 'docs');

    // Create docs directory if it doesn't exist
    if (!fs.existsSync(docsDirectory)) {
        fs.mkdirSync(docsDirectory, { recursive: true });
    }

    let filenames = [];
    try {
        filenames = fs.readdirSync(docsDirectory);
    } catch (error) {
        console.error('Error reading docs directory:', error);
    }

    const docFilenames = filenames.filter(filename => filename.endsWith('.md'));

    const paths = docFilenames.map((filename) => ({
        params: {
            slug: filename.replace(/\.md$/, ''),
        },
    }));

    return {
        paths,
        fallback: 'blocking',
    };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const docsDirectory = path.join(process.cwd(), 'docs');

    // Get all .md files for the sidebar
    let filenames = [];
    try {
        filenames = fs.readdirSync(docsDirectory);
    } catch (error) {
        console.error('Error reading docs directory:', error);
    }

    const allDocs = filenames.filter(filename => filename.endsWith('.md'));

    // Get the content of the requested document
    const filePath = path.join(docsDirectory, `${slug}.md`);

    // If the file doesn't exist, return a 404 page
    if (!fs.existsSync(filePath)) {
        return {
            notFound: true,
        };
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(fileContents);

    const title = data.title || slug;

    return {
        props: {
            content,
            title,
            allDocs,
        },
        // Revalidate every 10 seconds
        revalidate: 10,
    };
}
