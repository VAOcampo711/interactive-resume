import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Navbar from '../components/Navbar';

const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', { value: mockScrollTo });

describe('Navbar Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        document.getElementById = vi.fn(() => ({
            getBoundingClientRect: () => ({ top: 100 }),
            offsetHeight: 200,
        } as never));

        // The Navbar calls document.querySelector('nav') in two places:
        //   1. scrollToSection / handleScroll  — reads .offsetHeight
        //   2. handleClickOutside              — calls .contains(eventTarget)
        // Both must be satisfied by the mock.
        document.querySelector = vi.fn(() => ({
            offsetHeight: 60,
            contains: () => false,
        } as never));
    });

    afterEach(() => {
        vi.restoreAllMocks();
        document.body.style.overflow = 'unset';
    });

    // Test Case 1: Component renders with all navigation links
    it('renders all navigation sections in desktop view', () => {
        render(<Navbar />);

        const expectedSections = ['Introduction', 'Work', 'Education', 'Skills', 'Projects', 'Contact'];
        expectedSections.forEach((section) => {
            // getAllByRole because each label appears in both desktop and mobile nav
            const buttons = screen.getAllByRole('button', { name: section });
            expect(buttons.length).toBeGreaterThan(0);
        });
    });

    // Test Case 2: Mobile menu toggle functionality
    // The desktop <ul> is always in the DOM (just CSS-hidden via Tailwind), so
    // queryByRole('list') always finds it. Instead, we query for the mobile panel
    // div by its unique classes (.absolute.top-full), which only mounts when open.
    it('toggles mobile menu when hamburger button is clicked', () => {
        const { container } = render(<Navbar />);

        const toggleButton = screen.getByRole('button', { name: /toggle navigation menu/i });
        expect(toggleButton).toBeInTheDocument();

        const getMobilePanel = () => container.querySelector('.absolute.top-full');

        expect(getMobilePanel()).not.toBeInTheDocument();

        fireEvent.click(toggleButton);
        expect(getMobilePanel()).toBeInTheDocument();

        fireEvent.click(toggleButton);
        expect(getMobilePanel()).not.toBeInTheDocument();
    });

    // Test Case 3: Active section highlighting
    it('highlights active section correctly', () => {
        render(<Navbar />);

        // "introduction" is the default activeSection in useState
        const introButtons = screen.getAllByRole('button', { name: 'Introduction' });
        const hasActiveClass = introButtons.some((btn) =>
            btn.classList.contains('text-blue-600')
        );
        expect(hasActiveClass).toBe(true);

        // Non-active section must not carry the active background
        const workButtons = screen.getAllByRole('button', { name: 'Work' });
        workButtons.forEach((btn) => {
            expect(btn).not.toHaveClass('bg-blue-50');
        });
    });

    // Test Case 4: Scroll to section functionality
    it('scrolls to correct section when navigation link is clicked', () => {
        render(<Navbar />);

        const workButtons = screen.getAllByRole('button', { name: 'Work' });
        fireEvent.click(workButtons[0]);

        expect(mockScrollTo).toHaveBeenCalledWith(
            expect.objectContaining({ behavior: 'smooth' })
        );
    });

    // Test Case 5: Mobile menu closes when clicking outside
    // Uses the same panel-div strategy as Test 2. The mock's contains() returns
    // false, so the Navbar correctly treats any event target as "outside".
    it('closes mobile menu when clicking outside', async () => {
        const { container } = render(<Navbar />);

        const toggleButton = screen.getByRole('button', { name: /toggle navigation menu/i });
        const getMobilePanel = () => container.querySelector('.absolute.top-full');

        fireEvent.click(toggleButton);
        expect(getMobilePanel()).toBeInTheDocument();

        fireEvent.mouseDown(document.body);

        await waitFor(() => {
            expect(getMobilePanel()).not.toBeInTheDocument();
        });
    });

    // Test Case 6: Body overflow is controlled with mobile menu
    it('prevents body scroll when mobile menu is open', () => {
        render(<Navbar />);

        const toggleButton = screen.getByRole('button', { name: /toggle navigation menu/i });

        fireEvent.click(toggleButton);
        expect(document.body.style.overflow).toBe('hidden');

        fireEvent.click(toggleButton);
        expect(document.body.style.overflow).toBe('unset');
    });

    // Test Case 7: Mobile navigation shows username
    it('displays user name in mobile navigation header', () => {
        render(<Navbar />);
        expect(screen.getByText('Vince Ocampo')).toBeInTheDocument();
    });

    // Test Case 8: Scroll spy updates active section
    it('updates active section based on scroll position', async () => {
        document.getElementById = vi.fn((id) => {
            const tops: Record<string, number> = {
                introduction: 0,
                work: 300,
                education: 600,
                skills: 900,
                projects: 1200,
                contact: 1500,
            };
            return {
                getBoundingClientRect: () => ({ top: tops[id] ?? 9999 }),
                offsetHeight: 250,
            } as never;
        });

        render(<Navbar />);
        fireEvent.scroll(window, { target: { scrollY: 0 } });

        await waitFor(() => {
            const introButtons = screen.getAllByRole('button', { name: 'Introduction' });
            const hasActive = introButtons.some((btn) => btn.classList.contains('text-blue-600'));
            expect(hasActive).toBe(true);
        });
    });

    // Test Case 9: Responsive classes are applied
    it('applies correct responsive classes for desktop and mobile', () => {
        const { container } = render(<Navbar />);

        const desktopNav = container.querySelector('.hidden.md\\:block');
        expect(desktopNav).toBeInTheDocument();

        const mobileNav = container.querySelector('.md\\:hidden');
        expect(mobileNav).toBeInTheDocument();
    });

    // Test Case 10: Navigation links have correct accessibility attributes
    it('provides proper accessibility attributes', () => {
        const { container } = render(<Navbar />);

        const toggleButton = screen.getByRole('button', { name: /toggle navigation menu/i });
        expect(toggleButton).toHaveAttribute('aria-label', 'Toggle navigation menu');

        // Use container (real rendered DOM) instead of document.querySelector,
        // which is mocked in beforeEach and returns a plain object.
        const nav = container.querySelector('nav');
        expect(nav).toBeInTheDocument();
    });

    // Test Case 11: Clicking the backdrop closes the mobile menu
    it('closes mobile menu when the backdrop is clicked', () => {
        const { container } = render(<Navbar />);
        const getMobilePanel = () => container.querySelector('.absolute.top-full');

        fireEvent.click(screen.getByRole('button', { name: /toggle navigation menu/i }));
        expect(getMobilePanel()).toBeInTheDocument();

        fireEvent.click(container.querySelector('.fixed.inset-0') as Element);
        expect(getMobilePanel()).not.toBeInTheDocument();
    });

    // Test Case 12: Mobile menu item scrolls to the section and closes the menu
    it('scrolls and closes mobile menu when a mobile menu item is clicked', () => {
        const { container } = render(<Navbar />);
        const getMobilePanel = () => container.querySelector('.absolute.top-full');

        fireEvent.click(screen.getByRole('button', { name: /toggle navigation menu/i }));
        const mobileButtons = screen.getAllByRole('button', { name: 'Projects' });
        fireEvent.click(mobileButtons[mobileButtons.length - 1]);

        expect(mockScrollTo).toHaveBeenCalledWith({ top: 100 - 60 - 20, behavior: 'smooth' });
        expect(getMobilePanel()).not.toBeInTheDocument();
    });

    // Test Case 13: Missing section element is ignored
    it('does not scroll when the target section does not exist', () => {
        document.getElementById = vi.fn(() => null);
        render(<Navbar />);

        fireEvent.click(screen.getAllByRole('button', { name: 'Work' })[0]);

        expect(mockScrollTo).not.toHaveBeenCalled();
    });

    // Test Case 14: Falls back to zero offset when no navbar is found
    it('scrolls without navbar offset when the nav element is not found', () => {
        document.querySelector = vi.fn(() => null);
        render(<Navbar />);

        fireEvent.click(screen.getAllByRole('button', { name: 'Work' })[0]);

        expect(mockScrollTo).toHaveBeenCalledWith({ top: 100 - 20, behavior: 'smooth' });
    });
    describe('active section near the bottom of the page', () => {
        // Sections laid out 300px apart, as in Test Case 8
        const mockSectionLayout = () => {
            document.getElementById = vi.fn((id) => {
                const tops: Record<string, number> = {
                    introduction: 0,
                    work: 300,
                    education: 600,
                    skills: 900,
                    projects: 1200,
                    contact: 1500,
                };
                return {
                    getBoundingClientRect: () => ({ top: tops[id] ?? 9999 }),
                    offsetHeight: 250,
                } as never;
            });
        };

        const activeDesktopSection = () =>
            screen.getAllByRole('button')
                .find(btn => btn.classList.contains('bg-blue-50') && btn.classList.contains('rounded'))
                ?.textContent;

        afterEach(() => {
            vi.useRealTimers();
            fireEvent.scroll(window, { target: { scrollY: 0 } });
            Reflect.deleteProperty(document.documentElement, 'scrollHeight');
        });

        // Test Case 15: The clicked section stays highlighted while the page scrolls to it
        it('keeps the clicked section highlighted while scrolling to it', () => {
            vi.useFakeTimers();
            mockSectionLayout();
            render(<Navbar />);

            fireEvent.click(screen.getAllByRole('button', { name: 'Projects' })[0]);
            expect(activeDesktopSection()).toBe('Projects');

            // The page can't scroll Projects to the top, so the spy would otherwise pick Introduction here
            fireEvent.scroll(window, { target: { scrollY: 0 } });
            expect(activeDesktopSection()).toBe('Projects');
        });

        // Test Case 16: The scroll spy resumes once the scroll has settled
        it('resumes updating the active section after the scroll settles', () => {
            vi.useFakeTimers();
            mockSectionLayout();
            render(<Navbar />);

            fireEvent.click(screen.getAllByRole('button', { name: 'Projects' })[0]);
            act(() => {
                vi.advanceTimersByTime(200);
            });

            fireEvent.scroll(window, { target: { scrollY: 0 } });
            expect(activeDesktopSection()).toBe('Introduction');
        });

        // Test Case 17: Reaching the bottom of the page highlights the last section
        it('highlights Contact when scrolled to the bottom of the page', () => {
            mockSectionLayout();
            Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true });
            render(<Navbar />);

            fireEvent.scroll(window, { target: { scrollY: 2000 - window.innerHeight } });
            expect(activeDesktopSection()).toBe('Contact');
        });
    });
});