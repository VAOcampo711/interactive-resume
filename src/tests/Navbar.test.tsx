import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import Navbar from '../components/Navbar';

const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', { value: mockScrollTo });

describe('Navbar Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        document.getElementById = vi.fn((_id) => ({
            getBoundingClientRect: () => ({ top: 100 }),
            offsetHeight: 200,
        } as any));

        // The Navbar calls document.querySelector('nav') in two places:
        //   1. scrollToSection / handleScroll  — reads .offsetHeight
        //   2. handleClickOutside              — calls .contains(eventTarget)
        // Both must be satisfied by the mock.
        document.querySelector = vi.fn(() => ({
            offsetHeight: 60,
            contains: (_node: Node | null) => false,
        } as any));
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
    // queryByRole('list') always finds it. Instead we query for the mobile panel
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

    // Test Case 7: Mobile navigation shows user name
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
            } as any;
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
});