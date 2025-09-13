import type { Job } from "../types/resume";

export default function WorkExperience({ data }: { data: Job[] }) {
    // Group jobs by company
    const groupedJobs: { company: string; jobs: Job[] }[] = [];
    let currentCompany = '';
    let currentGroup: Job[] = [];

    data.forEach((job) => {
        if (job.company && job.company !== currentCompany) {
            // Save previous group if it exists
            if (currentGroup.length > 0) {
                groupedJobs.push({ company: currentCompany, jobs: currentGroup });
            }
            // Start new group
            currentCompany = job.company;
            currentGroup = [job];
        } else {
            // Add to current group (for jobs with empty company field)
            currentGroup.push(job);
        }
    });

    // Don't forget the last group
    if (currentGroup.length > 0) {
        groupedJobs.push({ company: currentCompany, jobs: currentGroup });
    }

    return (
        <section id="work" className="py-12 bg-white dark:bg-gray-900">
            <div className="container w-full max-w-5xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
                    Work Experience
                </h2>
                <div className="space-y-12">
                    {groupedJobs.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-b-2 border-blue-600 pb-2">
                                {group.company}
                            </h3>
                            <div className="space-y-6 ml-4">
                                {group.jobs.map((job, jobIdx) => (
                                    <div key={jobIdx} className="border-l-4 border-blue-600 pl-4">
                                        <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                            {job.role}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{job.period}</p>
                                        <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-300">
                                            {job.details.map((d, i) => <li key={i}>{d}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}