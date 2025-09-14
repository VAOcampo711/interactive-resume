import type { Job } from "../types/resume";

export default function WorkExperience({ data }: { data: Job[] }) {
    // Group jobs by company
    const groupedJobs: { company: string; jobs: Job[] }[] = [];
    let currentCompany = '';
    let currentGroup: Job[] = [];

    data.forEach((job) => {
        if (job.company && job.company !== currentCompany) {
            if (currentGroup.length > 0) {
                groupedJobs.push({ company: currentCompany, jobs: currentGroup });
            }
            currentCompany = job.company;
            currentGroup = [job];
        } else {
            currentGroup.push(job);
        }
    });

    if (currentGroup.length > 0) {
        groupedJobs.push({ company: currentCompany, jobs: currentGroup });
    }

    return (
        <section id="work" className="py-8 sm:py-12 bg-white dark:bg-gray-900">
            <div className="container w-full max-w-5xl mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-6 sm:mb-8">
                    Work Experience
                </h2>
                <div className="space-y-8 sm:space-y-12">
                    {groupedJobs.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-4 sm:space-y-6">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white border-b-2 border-blue-600 pb-2">
                                {group.company}
                            </h3>
                            <div className="space-y-4 sm:space-y-6 ml-0 sm:ml-4">
                                {group.jobs.map((job, jobIdx) => (
                                    <div key={jobIdx} className="border-l-4 border-blue-600 pl-4">
                                        <h4 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
                                            {job.role}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{job.period}</p>
                                        <ul className="list-disc list-inside mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 space-y-1">
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