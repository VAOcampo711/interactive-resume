import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Navbar from '../components/Navbar';

const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', { value: mockScrollTo, writable: true });

const defaultSectionTops: Record<string, number> = {
    introduction: 0,
    work: 300,
    education: 600,
    skills: 900,
    projects: 1200,
    contact: 1500,
};

const sectionIds = new Set(Object.keys(defaultSectionTops));

const mockSectionLayout = (tops: Record<string, number> = defaultSectionTops) => {
    const realGetElementById = Document.prototype.getElementById.bind(document);
    return vi.spyOn(document, 'getElementById').mockImplementation((id) => {
        if (!sectionIds.has(id)) {
            return realGetElementById(id);
        }
        return {
            getBoundingClientRect: () => ({ top: (tops[id] ?? 9999) - window.scrollY }),
            offsetHeight: 300,
        } as unknown as HTMLElement;
    });
};

const setNavHeight = (container: HTMLElement, height: number) => {
    const nav = container.querySelector('nav')!;
    Object.defineProperty(nav, 'offsetHeight', { value: height, configurable: true });
};

describe('Navbar Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        fireEvent.scroll(window, { target: { scrollY: 0 } });
        const realGetElementById = Document.prototype.getElementById.bind(document);
        vi.spyOn(document, 'getElementById').mockImplementation((id) => {
            if (!sectionIds.has(id)) {
                return realGetElementById(id);
            }
            return {
                getBoundingClientRect: () => ({ top: 100 - window.scrollY }),
                offsetHeight: 200,
            } as unknown as HTMLElement;
        });
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
        document.body.style.overflow = '';
        fireEvent.scroll(window, { target: { scrollY: 0 } });
        Reflect.deleteProperty(document.documentElement, 'scrollHeight');
        Reflect.deleteProperty(window, 'matchMedia');
    });

    it('renders all navigation sections in desktop view', () => {
        render(<Navbar name="Vince Ocampo" />);

        const expectedSections = ['Introduction', 'Work', 'Education', 'Skills', 'Projects', 'Contact'];
        expectedSections.forEach((section) => {
            const buttons = screen.getAllByRole('button', { name: section });
            expect(buttons.length).toBeGreaterThan(0);
            buttons.forEach((btn) => expect(btn).toHaveAttribute('type', 'button'));
        });
    });

    it('toggles mobile menu and updates aria-expanded when hamburger button is clicked', () => {
        const { container } = render(<Navbar name="Vince Ocampo" />);

        const toggleButton = screen.getByRole('button', { name: /toggle navigation menu/i });
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
        expect(toggleButton).toHaveAttribute('aria-controls', 'mobile-nav-menu');

        const getMobilePanel = () => container.querySelector('#mobile-nav-menu');
        expect(getMobilePanel()).not.toBeInTheDocument();

        fireEvent.click(toggleButton);
        expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
        expect(getMobilePanel()).toBeInTheDocument();

        fireEvent.click(toggleButton);
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
        expect(getMobilePanel()).not.toBeInTheDocument();
    });

    it('highlights active section and sets aria-current correctly', () => {
        render(<Navbar name="Vince Ocampo" />);

        const introButtons = screen.getAllByRole('button', { name: 'Introduction' });
        expect(introButtons[0]).toHaveClass('text-blue-600', 'bg-blue-50');
        expect(introButtons[0]).toHaveAttribute('aria-current', 'true');

        const workButtons = screen.getAllByRole('button', { name: 'Work' });
        workButtons.forEach((btn) => {
            expect(btn).not.toHaveClass('bg-blue-50');
            expect(btn).not.toHaveAttribute('aria-current');
        });
    });

    it('scrolls to correct section when navigation link is clicked', () => {
        const { container } = render(<Navbar name="Vince Ocampo" />);
        setNavHeight(container, 60);

        const workButtons = screen.getAllByRole('button', { name: 'Work' });
        fireEvent.click(workButtons[0]);

        expect(mockScrollTo).toHaveBeenCalledWith({
            top: 100 - 60 - 20,
            behavior: 'smooth',
        });
    });

    it('respects prefers-reduced-motion when scrolling to a section', () => {
        Object.defineProperty(window, 'matchMedia', {
            configurable: true,
            value: vi.fn().mockReturnValue({ matches: true }),
        });

        render(<Navbar name="Vince Ocampo" />);
        fireEvent.click(screen.getAllByRole('button', { name: 'Work' })[0]);

        expect(mockScrollTo).toHaveBeenCalledWith(
            expect.objectContaining({ behavior: 'auto' })
        );
    });

    it('does not close mobile menu on mousedown, so a backdrop tap cannot click through to the page', () => {
        const { container } = render(<Navbar name="Vince Ocampo" />);
        const getMobilePanel = () => container.querySelector('#mobile-nav-menu');

        fireEvent.click(screen.getByRole('button', { name: /toggle navigation menu/i }));
        const backdrop = container.querySelector('.fixed.inset-0') as Element;

        // The backdrop must stay mounted until the tap's click arrives
        fireEvent.mouseDown(backdrop);
        fireEvent.mouseDown(document.body);
        expect(getMobilePanel()).toBeInTheDocument();
        expect(backdrop).toBeInTheDocument();

        fireEvent.click(backdrop);
        expect(getMobilePanel()).not.toBeInTheDocument();
    });

    it('closes mobile menu when Escape is pressed and ignores other keys', () => {
        const { container } = render(<Navbar name="Vince Ocampo" />);
        const getMobilePanel = () => container.querySelector('#mobile-nav-menu');

        fireEvent.click(screen.getByRole('button', { name: /toggle navigation menu/i }));
        expect(getMobilePanel()).toBeInTheDocument();

        fireEvent.keyDown(document, { key: 'Enter' });
        expect(getMobilePanel()).toBeInTheDocument();

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(getMobilePanel()).not.toBeInTheDocument();
    });

    it('closes mobile menu and restores body scroll when widened past the md breakpoint', () => {
        let onDesktopChange: ((event: { matches: boolean }) => void) | undefined;
        const desktopQuery = {
            matches: false,
            addEventListener: vi.fn((_type: string, listener: typeof onDesktopChange) => {
                onDesktopChange = listener;
            }),
            removeEventListener: vi.fn(),
        };
        const matchMedia = vi.fn().mockReturnValue(desktopQuery);
        Object.defineProperty(window, 'matchMedia', { configurable: true, value: matchMedia });

        const { container } = render(<Navbar name="Vince Ocampo" />);
        const getMobilePanel = () => container.querySelector('#mobile-nav-menu');

        fireEvent.click(screen.getByRole('button', { name: /toggle navigation menu/i }));
        expect(getMobilePanel()).toBeInTheDocument();
        expect(document.body.style.overflow).toBe('hidden');
        expect(matchMedia).toHaveBeenCalledWith('(min-width: 48rem)');

        // Still below md — stays open
        act(() => onDesktopChange?.({ matches: false }));
        expect(getMobilePanel()).toBeInTheDocument();

        // Crossed into md — closes, restores scroll and stops listening
        act(() => onDesktopChange?.({ matches: true }));
        expect(getMobilePanel()).not.toBeInTheDocument();
        expect(document.body.style.overflow).toBe('');
        expect(desktopQuery.removeEventListener).toHaveBeenCalledWith('change', onDesktopChange);
    });

    it('prevents body scroll when mobile menu is open and clears it when closed', () => {
        render(<Navbar name="Vince Ocampo" />);

        const toggleButton = screen.getByRole('button', { name: /toggle navigation menu/i });

        fireEvent.click(toggleButton);
        expect(document.body.style.overflow).toBe('hidden');

        fireEvent.click(toggleButton);
        expect(document.body.style.overflow).toBe('');
    });

    it('displays the provided name in mobile navigation header', () => {
        render(<Navbar name="Jane Doe" />);
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('updates active section as the page scrolls through sections', () => {
        mockSectionLayout();
        const { container } = render(<Navbar name="Vince Ocampo" />);
        setNavHeight(container, 60);

        const activeDesktopSection = () =>
            screen.getAllByRole('button')
                .find(btn => btn.getAttribute('aria-current') === 'true')
                ?.textContent;

        expect(activeDesktopSection()).toBe('Introduction');

        fireEvent.scroll(window, { target: { scrollY: 300 } });
        expect(activeDesktopSection()).toBe('Work');

        fireEvent.scroll(window, { target: { scrollY: 900 } });
        expect(activeDesktopSection()).toBe('Skills');
    });

    it('applies correct responsive classes for desktop and mobile', () => {
        const { container } = render(<Navbar name="Vince Ocampo" />);

        expect(container.querySelector('.hidden.md\\:block')).toBeInTheDocument();
        expect(container.querySelector('.md\\:hidden')).toBeInTheDocument();
    });

    it('renders backdrop outside nav and closes mobile menu when backdrop is clicked', () => {
        const { container } = render(<Navbar name="Vince Ocampo" />);
        const getMobilePanel = () => container.querySelector('#mobile-nav-menu');
        const nav = container.querySelector('nav')!;

        fireEvent.click(screen.getByRole('button', { name: /toggle navigation menu/i }));
        expect(getMobilePanel()).toBeInTheDocument();

        const backdrop = container.querySelector('.fixed.inset-0') as Element;
        expect(backdrop).toBeInTheDocument();
        // Must not be inside <nav> so backdrop-blur does not trap position: fixed
        expect(nav.contains(backdrop)).toBe(false);

        fireEvent.click(backdrop);
        expect(getMobilePanel()).not.toBeInTheDocument();
    });

    it('scrolls and closes mobile menu when a mobile menu item is clicked', () => {
        const { container } = render(<Navbar name="Vince Ocampo" />);
        setNavHeight(container, 60);
        const getMobilePanel = () => container.querySelector('#mobile-nav-menu');

        fireEvent.click(screen.getByRole('button', { name: /toggle navigation menu/i }));
        const mobileButtons = screen.getAllByRole('button', { name: 'Projects' });
        fireEvent.click(mobileButtons[mobileButtons.length - 1]);

        expect(mockScrollTo).toHaveBeenCalledWith({ top: 100 - 60 - 20, behavior: 'smooth' });
        expect(getMobilePanel()).not.toBeInTheDocument();
    });

    it('does not scroll when the target section does not exist', () => {
        vi.spyOn(document, 'getElementById').mockReturnValue(null);
        render(<Navbar name="Vince Ocampo" />);

        fireEvent.click(screen.getAllByRole('button', { name: 'Work' })[0]);

        expect(mockScrollTo).not.toHaveBeenCalled();
    });

    it('scrolls with zero navbar offset when nav height is zero', () => {
        render(<Navbar name="Vince Ocampo" />);

        fireEvent.click(screen.getAllByRole('button', { name: 'Work' })[0]);

        expect(mockScrollTo).toHaveBeenCalledWith({ top: 100 - 20, behavior: 'smooth' });
    });

    describe('active section near the bottom of the page', () => {
        const activeDesktopSection = () =>
            screen.getAllByRole('button')
                .find(btn => btn.getAttribute('aria-current') === 'true')
                ?.textContent;

        it('keeps the clicked section highlighted while scrolling to it', () => {
            vi.useFakeTimers();
            mockSectionLayout();
            render(<Navbar name="Vince Ocampo" />);

            fireEvent.click(screen.getAllByRole('button', { name: 'Projects' })[0]);
            expect(activeDesktopSection()).toBe('Projects');

            // The page can't scroll Projects to the top, so the spy would otherwise pick Introduction here
            fireEvent.scroll(window, { target: { scrollY: 0 } });
            expect(activeDesktopSection()).toBe('Projects');
        });

        it('resumes updating the active section after the scroll settles', () => {
            vi.useFakeTimers();
            mockSectionLayout();
            render(<Navbar name="Vince Ocampo" />);

            fireEvent.click(screen.getAllByRole('button', { name: 'Projects' })[0]);
            act(() => {
                vi.advanceTimersByTime(200);
            });

            fireEvent.scroll(window, { target: { scrollY: 0 } });
            expect(activeDesktopSection()).toBe('Introduction');
        });

        it('re-checks the active section if the user scrolls away before navigation settles', () => {
            vi.useFakeTimers();
            mockSectionLayout();
            Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true });
            render(<Navbar name="Vince Ocampo" />);

            fireEvent.click(screen.getAllByRole('button', { name: 'Projects' })[0]);
            // The user scrolls back up to Work while the smooth scroll is still running
            fireEvent.scroll(window, { target: { scrollY: 300 } });
            expect(activeDesktopSection()).toBe('Projects');

            act(() => {
                vi.advanceTimersByTime(200);
            });
            expect(activeDesktopSection()).toBe('Work');
        });

        it('keeps the clicked section when the page stops short of it at the bottom', () => {
            vi.useFakeTimers();
            mockSectionLayout();
            // Max scroll is 1500 - 768 = 732, short of Projects at 1200
            Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1500, configurable: true });
            render(<Navbar name="Vince Ocampo" />);

            fireEvent.click(screen.getAllByRole('button', { name: 'Projects' })[0]);
            fireEvent.scroll(window, { target: { scrollY: 1500 - window.innerHeight } });

            act(() => {
                vi.advanceTimersByTime(200);
            });
            expect(activeDesktopSection()).toBe('Projects');
        });

        it('highlights Contact when scrolled to the bottom of the page', () => {
            mockSectionLayout();
            Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true });
            render(<Navbar name="Vince Ocampo" />);

            fireEvent.scroll(window, { target: { scrollY: 2000 - window.innerHeight } });
            expect(activeDesktopSection()).toBe('Contact');
        });
    });
});
