import type { Project } from "../types/resume";

export default function Projects({ data }: { data: Project[] }) {
    return (
        <section id="projects" className="py-8 sm:py-12 bg-gray-50 dark:bg-gray-800">
            <div className="container w-full max-w-5xl mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-900 dark:text-white">
                    Personal Projects
                </h2>
                {/* Single column on mobile, 2 columns on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {data.map((p, idx) => (
                        <div
                            key={idx}
                            className="p-4 sm:p-6 rounded-2xl shadow bg-white dark:bg-gray-900 hover:scale-105 transition"
                        >
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                                {p.title}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{p.description}</p>
                            {p.github && (
                                <a
                                    href={p.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm sm:text-base text-blue-600 dark:text-blue-400 mt-2 inline-block hover:underline"
                                >
                                    View on GitHub
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
