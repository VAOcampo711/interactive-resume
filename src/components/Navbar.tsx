import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const sections = ["introduction", "work", "education", "skills", "projects", "contact"] as const;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const navbarHeight = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
        setIsMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur shadow z-10">
            <div className="container w-full max-w-5xl mx-auto px-4 sm:px-6">
                {/* Desktop Navigation */}
                <div className="hidden md:flex justify-center py-4">
                    <ul className="flex gap-6 items-center">
                        {sections.map((s) => (
                            <li key={s}>
                                <button
                                    onClick={() => scrollToSection(s)}
                                    className="text-gray-700 dark:text-gray-200 hover:text-blue-600 capitalize font-medium"
                                >
                                    {s}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                    <div className="flex items-center justify-between py-3">
                        <span/>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pb-3">
                            <ul className="space-y-1 pt-3">
                                {sections.map((s) => (
                                    <li key={s}>
                                        <button
                                            onClick={() => scrollToSection(s)}
                                            className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 capitalize font-medium rounded-lg"
                                        >
                                            {s}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}