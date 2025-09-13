import type { EducationEntry } from "../types/resume";

export default function Education({ data }: { data: EducationEntry[] }) {
    // Group education by institution
    const groupedEducation: { institution: string; entries: EducationEntry[] }[] = [];

    data.forEach((edu) => {
        const existingGroup = groupedEducation.find(group => group.institution === edu.institution);
        if (existingGroup) {
            existingGroup.entries.push(edu);
        } else {
            groupedEducation.push({ institution: edu.institution, entries: [edu] });
        }
    });

    return (
        <section id="education" className="py-12 bg-gray-50 dark:bg-gray-800">
            <div className="container w-full max-w-5xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                    Education
                </h2>
                <div className="space-y-8">
                    {groupedEducation.map((group, groupIdx) => (
                        <div key={groupIdx} className="p-6 rounded-2xl shadow bg-white dark:bg-gray-900">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 border-b-2 border-blue-600 pb-2">
                                {group.institution}
                            </h3>
                            <div className="space-y-3 ml-4">
                                {group.entries.map((edu, eduIdx) => (
                                    <div key={eduIdx}>
                                        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                            {edu.degree}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {edu.year}
                                        </p>
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