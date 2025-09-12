export default function Navbar() {
    const sections = ["introduction", "work", "education", "skills", "projects", "contact"] as const;

    return (
        <nav className="sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur shadow z-10">
            <div className="container w-full max-w-5xl mx-auto px-4">
                <ul className="flex gap-6 justify-center items-center">
                    {sections.map((s) => (
                        <li key={s}>
                            <button
                                onClick={() => document.getElementById(s)?.scrollIntoView({ behavior: "smooth" })}
                                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 capitalize font-medium"
                            >
                                {s}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
