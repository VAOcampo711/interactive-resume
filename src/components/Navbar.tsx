import { useState, useEffect, useRef, useCallback } from 'react';
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

// Tailwind's md breakpoint (48rem), where md:hidden hides the mobile menu
const DESKTOP_MEDIA_QUERY = '(min-width: 48rem)';

// Returns the section under the navbar, or the last section when scrolled to the bottom
const getActiveSection = (navbarHeight: number): SectionId | undefined => {
    // At the bottom of a scrollable page, the last section can't reach the top, so pick it directly
    const { scrollHeight } = document.documentElement;
    const isScrollable = scrollHeight > window.innerHeight;
    if (isScrollable && window.innerHeight + window.scrollY >= scrollHeight - 2) {
        return sections[sections.length - 1];
    }

    const scrollPosition = window.scrollY + navbarHeight + 50; // Add some buffer

    return sections.find((section) => {
        const element = document.getElementById(section);
        if (!element) {
            return false;
        }
        const offsetTop = element.getBoundingClientRect().top + window.scrollY;
        return scrollPosition >= offsetTop && scrollPosition < offsetTop + element.offsetHeight;
    });
};

export default function Navbar({ name }: { name: string }) {
    const [activeSection, setActiveSection] = useState<SectionId>("introduction");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    // True while scrolling to a clicked section, so the scroll spy doesn't override the highlight
    const isNavigatingRef = useRef(false);
    const navigationTimerRef = useRef<number | undefined>(undefined);
    // Scroll position the current navigation will stop at
    const navigationTargetRef = useRef(0);

    const updateActiveSection = useCallback(() => {
        const section = getActiveSection(navRef.current?.offsetHeight ?? 0);
        if (section) {
            setActiveSection(section);
        }
    }, []);

    // Ends navigation once scrolling has been idle for a moment (also covers clicks that don't scroll).
    // If the user scrolled away from the clicked section in the meantime, re-check what's in view.
    const settleNavigation = useCallback(() => {
        window.clearTimeout(navigationTimerRef.current);
        navigationTimerRef.current = window.setTimeout(() => {
            isNavigatingRef.current = false;
            if (Math.abs(window.scrollY - navigationTargetRef.current) > 2) {
                updateActiveSection();
            }
        }, 150);
    }, [updateActiveSection]);

    const scrollToSection = (sectionId: SectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            // Close mobile menu when navigating
            setIsMobileMenuOpen(false);

            const navbarHeight = navRef.current?.offsetHeight ?? 0;

            // Calculate the position to scroll to (element top - navbar height - some padding)
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - navbarHeight - 20; // 20px extra padding

            // The page can't scroll past its bottom, so that's where scrolling to a late section stops
            const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            navigationTargetRef.current = Math.min(Math.max(0, offsetPosition), maxScroll);

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
            updateActiveSection();
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial call to set active section
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.clearTimeout(navigationTimerRef.current);
        };
    }, [settleNavigation, updateActiveSection]);

    // Close mobile menu on Escape or when widened to desktop, and lock body scroll while open.
    // Taps outside the menu land on the backdrop, which closes it on click. Don't also close on
    // mousedown: that removes the backdrop mid-tap and lets the click hit the page underneath.
    useEffect(() => {
        if (!isMobileMenuOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMobileMenuOpen(false);
            }
        };

        const desktopQuery = window.matchMedia?.(DESKTOP_MEDIA_QUERY);
        const handleDesktopChange = (event: MediaQueryListEvent) => {
            if (event.matches) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        desktopQuery?.addEventListener('change', handleDesktopChange);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            desktopQuery?.removeEventListener('change', handleDesktopChange);
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
