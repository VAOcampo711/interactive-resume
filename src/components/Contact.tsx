import type { ContactInfo } from "../types/resume";

export default function Contact({ data }: { data: ContactInfo }) {
    return (
        <section id="contact" className="py-12 bg-white dark:bg-gray-900 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Contact</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Feel free to reach out via email or LinkedIn</p>
            <div className="flex justify-center gap-6">
                <a href={`mailto:${data.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    Email
                </a>
                <a href={data.linkedin} className="text-blue-600 dark:text-blue-400 hover:underline">
                    LinkedIn
                </a>
                {data.github && (
                    <a href={data.github} className="text-blue-600 dark:text-blue-400 hover:underline">
                        GitHub
                    </a>
                )}
            </div>
        </section>
    );
}
