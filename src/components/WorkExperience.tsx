import type { Job } from "../types/resume";

export default function WorkExperience({ data }: { data: Job[] }) {
    return (
        <section id="work" className="py-12 bg-white dark:bg-gray-900">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
                Work Experience
            </h2>
            <div className="space-y-8 max-w-3xl mx-auto">
                {data.map((job, idx) => (
                    <div key={idx} className="border-l-4 border-blue-600 pl-4">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{job.role} @ {job.company}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{job.period}</p>
                        <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-300">
                            {job.details.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
