import type { ContactInfo } from "../types/resume";
import DownloadButtons from './DownloadButtons';

const linkClassName =
    "px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 font-medium hover:shadow text-sm sm:text-base";

export default function Contact({ data }: { data: ContactInfo }) {
    const telHref = `tel:${data.mobile.replace(/\s+/g, '')}`;

    return (
        <section id="contact" className="py-8 sm:py-16 bg-white dark:bg-gray-900 text-center">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                    Contact
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
                    Feel free to reach out via
                </p>
                {/* Stack vertically on mobile, horizontal on larger screens */}
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 lg:gap-8">
                    <a href={`mailto:${data.email}`} className={linkClassName}>
                        Email
                    </a>
                    <a href={telHref} className={linkClassName}>
                        Mobile
                    </a>
                    <a
                        href={data.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClassName}
                    >
                        LinkedIn
                    </a>
                    {data.github && (
                        <a
                            href={data.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClassName}
                        >
                            GitHub
                        </a>
                    )}
                </div>
                <DownloadButtons />
            </div>
        </section>
    );
}
