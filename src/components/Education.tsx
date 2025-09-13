import type { EducationEntry } from "../types/resume";

export default function Education({ data }: { data: EducationEntry[] }) {
    return (
        <section id="education" className="py-12 bg-gray-50 dark:bg-gray-800">
            <div className="container w-full max-w-5xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                    Education
                </h2>
                <div className="space-y-4">
                    {data.map((edu, idx) => (
                        <div key={idx} className="p-6 rounded-2xl shadow bg-white dark:bg-gray-900">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                {edu.degree}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {edu.institution}, {edu.year}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
