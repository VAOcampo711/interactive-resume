import type {ContactInfo} from "../types/resume";
import {useEffect, useRef} from 'react';

export default function Contact({data}: { data: ContactInfo }) {
    const contactRef = useRef<HTMLElement>(null);

    // Method 1: Auto-modify external links to open in new tabs
    useEffect(() => {
        if (contactRef.current) {
            const links = contactRef.current.querySelectorAll('a[href^="http"], a[href^="//"]');
            links.forEach(link => {
                const linkElement = link as HTMLAnchorElement;
                linkElement.setAttribute('target', '_blank');
                linkElement.setAttribute('rel', 'noopener noreferrer');
            });
        }
    }, [data]); // Re-run when data changes

    return (
        <section id="contact" className="py-16 bg-white dark:bg-gray-900 text-center" ref={contactRef}>
            <div className="container w-full max-w-5xl mx-auto px-6">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                    Contact
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Feel free to reach out via email, LinkedIn, or GitHub
                </p>
                <div className="flex flex-wrap justify-center gap-8">
                    <a
                        href={`mailto:${data.email}`}
                        className="px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 font-medium hover:shadow"
                    >
                        Email
                    </a>
                    <a
                        href={data.linkedin}
                        className="px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 font-medium hover:shadow"
                    >
                        LinkedIn
                    </a>
                    {data.github && (
                        <a
                            href={data.github}
                            className="px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 font-medium hover:shadow"
                        >
                            GitHub
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}