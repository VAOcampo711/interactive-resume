import type { SkillCategory } from "../types/resume";

export default function Skills({ data }: { data: SkillCategory[] }) {
    return (
        <section id="skills" className="py-8 sm:py-12 bg-white dark:bg-gray-900">
            <div className="container w-full max-w-5xl mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-900 dark:text-white">
                    Core Technical Skills
                </h2>
                <div className="space-y-6 sm:space-y-8">
                    {data.map((skillGroup, idx) => (
                        <div key={idx} className="text-center">
                            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200">
                                {skillGroup.category}
                            </h3>
                            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                {skillGroup.skills.map((skill, skillIdx) => (
                                    <span
                                        key={skillIdx}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 text-xs sm:text-sm font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}