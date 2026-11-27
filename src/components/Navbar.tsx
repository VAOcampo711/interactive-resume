import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

const sections = ["introduction", "work", "education", "skills", "projects", "contact"] as const;
type SectionId = (typeof sections)[number];

const sectionDisplayNames: Record<SectionId, string> = {
    introduction: "Introduction",
    work: "Work",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    contact: "Contact"
};

const DESKTOP_BREAKPOINT = 768;

export default function Navbar({ name }: { name: string }) {
    const [activeSection, setActiveSection] = useState<SectionId>("introduction");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    // True while scrolling to a clicked section, so the scroll spy doesn't override the highlight
    const isNavigatingRef = useRef(false);
    const navigationTimerRef = useRef<number | undefined>(undefined);

    // Ends navigation once scrolling has been idle for a moment (also covers clicks that don't scroll)
    const settleNavigation = () => {
        window.clearTimeout(navigationTimerRef.current);
        navigationTimerRef.current = window.setTimeout(() => {
            isNavigatingRef.current = false;
        }, 150);
    };

    const scrollToSection = (sectionId: SectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            // Close mobile menu when navigating
            setIsMobileMenuOpen(false);

            const navbarHeight = navRef.current?.offsetHeight ?? 0;

            // Calculate the position to scroll to (element top - navbar height - some padding)
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - navbarHeight - 20; // 20px extra padding

            // Highlight the clicked section straight away. Sections near the bottom of the page
            // can't always be scrolled to the top, so the scroll spy would pick one above them.
            setActiveSection(sectionId);
            isNavigatingRef.current = true;
            settleNavigation();

            const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
            window.scrollTo({
                top: offsetPosition,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        }
    };

    // Scroll spy functionality
    useEffect(() => {
        const handleScroll = () => {
            if (isNavigatingRef.current) {
                settleNavigation();
                return;
            }

            // At the bottom of a scrollable page, the last section can't reach the top, so pick it directly
            const { scrollHeight } = document.documentElement;
            const isScrollable = scrollHeight > window.innerHeight;
            if (isScrollable && window.innerHeight + window.scrollY >= scrollHeight - 2) {
                setActiveSection(sections[sections.length - 1]);
                return;
            }

            const navbarHeight = navRef.current?.offsetHeight ?? 0;
            const scrollPosition = window.scrollY + navbarHeight + 50; // Add some buffer

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.getBoundingClientRect().top + window.scrollY;
                    const offsetBottom = offsetTop + element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial call to set active section
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.clearTimeout(navigationTimerRef.current);
        };
    }, []);

    // Close mobile menu on outside click, Escape key, or resize to desktop, and lock body scroll while open
    useEffect(() => {
        if (!isMobileMenuOpen) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMobileMenuOpen(false);
            }
        };

        const handleResize = () => {
            if (window.innerWidth >= DESKTOP_BREAKPOINT) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', handleResize);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', handleResize);
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    return (
        <>
            <nav
                ref={navRef}
                className="sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur shadow z-50 print:hidden"
            >
                <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
                    {/* Desktop Navigation */}
                    <div className="hidden md:block py-3">
                        <ul className="flex gap-6 justify-center items-center">
                            {sections.map((s) => (
                                <li key={s}>
                                    <button
                                        type="button"
                                        onClick={() => scrollToSection(s)}
                                        aria-current={activeSection === s ? 'true' : undefined}
                                        className={`font-medium px-3 py-2 text-base transition-colors duration-200 rounded ${
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
                            {name}
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen((open) => !open)}
                            className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle navigation menu"
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-nav-menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu Panel */}
                    {isMobileMenuOpen && (
                        <div
                            id="mobile-nav-menu"
                            className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50 md:hidden"
                        >
                            <ul className="py-4">
                                {sections.map((s) => (
                                    <li key={s}>
                                        <button
                                            type="button"
                                            onClick={() => scrollToSection(s)}
                                            aria-current={activeSection === s ? 'true' : undefined}
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
                    )}
                </div>
            </nav>

            {/* Backdrop rendered outside <nav> so backdrop-blur does not trap position: fixed */}
            {isMobileMenuOpen && (
                <div
                    aria-hidden="true"
                    className="fixed inset-0 bg-black/50 z-40 md:hidden print:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
