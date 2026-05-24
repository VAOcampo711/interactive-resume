import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import App from '../App';

describe('App Component', () => {
    // Test Case 1: App renders without crashing
    it('renders without crashing', () => {
        expect(() => render(<App />)).not.toThrow();
    });

    // Test Case 2: All main sections are present
    it('renders all main sections', () => {
        render(<App />);

        expect(document.getElementById('introduction')).toBeInTheDocument();
        expect(document.getElementById('work')).toBeInTheDocument();
        expect(document.getElementById('education')).toBeInTheDocument();
        expect(document.getElementById('skills')).toBeInTheDocument();
        expect(document.getElementById('projects')).toBeInTheDocument();
        expect(document.getElementById('contact')).toBeInTheDocument();
    });

    // Test Case 3: Navbar is present
    it('renders navigation bar', () => {
        const { container } = render(<App />);

        const navbar = container.querySelector('nav');
        expect(navbar).toBeInTheDocument();
        expect(navbar).toHaveClass('sticky', 'top-0');
    });

    // Test Case 4: Main container has correct structure
    it('has correct main container structure', () => {
        const { container } = render(<App />);

        const main = container.querySelector('main');
        expect(main).toBeInTheDocument();
        expect(main).toHaveClass('max-w-5xl', 'mx-auto');
        expect(main).toHaveClass('px-4', 'sm:px-6');
    });

    // Test Case 5: Dark mode classes are applied
    it('applies dark mode background classes', () => {
        const { container } = render(<App />);

        const rootDiv = container.firstChild as HTMLElement;
        expect(rootDiv).toHaveClass('bg-gray-50', 'dark:bg-gray-900');
    });

    // Test Case 6: Resume data is passed to components correctly
    it('passes resume data to all components correctly', () => {
        render(<App />);

        // Introduction data — target the h1 specifically to avoid matching the navbar span
        expect(screen.getByRole('heading', { level: 1, name: 'Vince Ocampo' })).toBeInTheDocument();

        // Work experience data
        expect(screen.getByText('Foster Moore - The registry people®')).toBeInTheDocument();

        // Education data
        expect(screen.getByText('University of Auckland')).toBeInTheDocument();

        // Skills data
        expect(screen.getByText('React')).toBeInTheDocument();

        // Projects data
        expect(screen.getByText('Interactive Resume')).toBeInTheDocument();

        // Contact data — email link
        expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
            'href',
            'mailto:vinceocampo711@icloud.com'
        );
    });

    // Test Case 7: Responsive container classes
    it('applies responsive container classes', () => {
        const { container } = render(<App />);

        const main = container.querySelector('main');
        expect(main).toHaveClass('w-full', 'max-w-5xl', 'mx-auto', 'px-4', 'sm:px-6');
    });

    // Test Case 8: CSS imports are working
    it('imports and applies CSS correctly', () => {
        const { container } = render(<App />);

        const rootDiv = container.firstChild as HTMLElement;
        expect(rootDiv).toHaveClass(
            'bg-gray-50',
            'dark:bg-gray-900',
            'text-gray-900',
            'dark:text-gray-100',
            'min-h-screen'
        );
    });
});