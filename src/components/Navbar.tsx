import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const sections = ["introduction", "work", "education", "skills", "projects", "contact"] as const;
    const [activeSection, setActiveSection] = useState<string>("introduction");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            // Close mobile menu when navigating
            setIsMobileMenuOpen(false);

            // Get the navbar height to calculate offset
            const navbar = document.querySelector('nav');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;

            // Calculate the position to scroll to (element top - navbar height - some padding)
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navbarHeight - 20; // 20px extra padding

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Scroll spy functionality
    useEffect(() => {
        const handleScroll = () => {
            const navbar = document.querySelector('nav');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const scrollPosition = window.scrollY + navbarHeight + 50; // Add some buffer

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.getBoundingClientRect().top + window.pageYOffset;
                    const offsetBottom = offsetTop + element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial call to set active section
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const nav = document.querySelector('nav');
            if (nav && !nav.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const sectionDisplayNames = {
        introduction: "Introduction",
        work: "Work",
        education: "Education",
        skills: "Skills",
        projects: "Projects",
        contact: "Contact"
    };

    return (
        <nav className="sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur shadow z-50">
            <div className="container w-full max-w-5xl mx-auto px-4">
                {/* Desktop Navigation */}
                <div className="hidden md:block py-3">
                    <ul className="flex gap-6 justify-center items-center">
                        {sections.map((s) => (
                            <li key={s}>
                                <button
                                    onClick={() => scrollToSection(s)}
                                    className={`capitalize font-medium px-3 py-2 text-base transition-colors duration-200 rounded ${
                                        activeSection === s
                                            ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    {sectionDisplayNames[s]}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden py-3 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                        Vince Ocampo
                    </span>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Toggle navigation menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Menu Panel */}
                        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50 md:hidden">
                            <ul className="py-4">
                                {sections.map((s) => (
                                    <li key={s}>
                                        <button
                                            onClick={() => scrollToSection(s)}
                                            className={`w-full text-left px-6 py-4 text-base font-medium transition-colors duration-200 ${
                                                activeSection === s
                                                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 border-r-4 border-blue-600'
                                                    : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            {sectionDisplayNames[s]}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}