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
    isHtml: boolean;
}

export default function DocPage({ content, title, allDocs, isHtml }: DocPageProps) {
    return (
        <>
            <Head>
                <title>{title} - Documentation</title>
                <meta name="description" content={`Documentation for ${title}`} />
            </Head>

            <article>
                {isHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                    <ReactMarkdown
                        remarkPlugins={[gfm]}
                        rehypePlugins={[rehypeHighlight]}
                    >
                        {content}
                    </ReactMarkdown>
                )}
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

    let filenames: string[] = [];
    try {
        filenames = fs.readdirSync(docsDirectory);
    } catch (error) {
        console.error('Error reading docs directory:', error);
    }

    const docFilenames = filenames.filter(filename =>
        filename.endsWith('.md') || filename.endsWith('.html')
    );

    const paths = docFilenames.map((filename) => ({
        params: {
            slug: filename.replace(/\.(md|html)$/, ''),
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

    // Get all .md and .html files for the sidebar
    let filenames: string[] = [];
    try {
        filenames = fs.readdirSync(docsDirectory);
    } catch (error) {
        console.error('Error reading docs directory:', error);
    }

    const allDocs = filenames.filter(filename =>
        filename.endsWith('.md') || filename.endsWith('.html')
    );

    // First try to find a markdown file
    let filePath = path.join(docsDirectory, `${slug}.md`);
    let isHtml = false;

    // If markdown file doesn't exist, try HTML
    if (!fs.existsSync(filePath)) {
        filePath = path.join(docsDirectory, `${slug}.html`);
        isHtml = true;

        // If neither exists, return 404
        if (!fs.existsSync(filePath)) {
            return {
                notFound: true,
            };
        }
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    let content = fileContents;
    let title = slug;

    // If it's a markdown file, process it with gray-matter
    if (!isHtml) {
        const { content: markdownContent, data } = matter(fileContents);
        content = markdownContent;
        title = data.title || slug;
    }

    return {
        props: {
            content,
            title,
            allDocs,
            isHtml
        },
        // Revalidate every 10 seconds
        revalidate: 10,
    };
}
