export default function Skills({ data }: { data: string[] }) {
    return (
        <section id="skills" className="py-12 bg-white dark:bg-gray-900">
            <div className="container w-full max-w-5xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                    Skills
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                    {data.map((skill, idx) => (
                        <span
                            key={idx}
                            className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 text-sm font-medium"
                        >
              {skill}
            </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
