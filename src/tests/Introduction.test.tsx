import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import Introduction from '../components/Introduction';
import type { Introduction as IntroType } from '../types/resume';

const mockIntroductionData: IntroType = {
    name: 'Vince Ocampo',
    tagline: 'Software developer with experience in configuration, full-stack development and automation testing.'
};

describe('Introduction Component', () => {
    // Test Case 1: Component renders with correct structure
    it('renders introduction section with correct structure', () => {
        const { container } = render(<Introduction data={mockIntroductionData} />);

        const section = container.querySelector('section#introduction');
        expect(section).toBeInTheDocument();
        expect(section).toHaveClass('py-16', 'sm:py-20', 'bg-gray-50', 'dark:bg-gray-800');

        const innerContainer = container.querySelector('section#introduction > div');
        expect(innerContainer).toHaveClass('text-center');
    });

    // Test Case 2: Name is displayed correctly
    it('displays the name as main heading', () => {
        render(<Introduction data={mockIntroductionData} />);

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Vince Ocampo');
        expect(heading).toHaveClass('font-extrabold', 'text-gray-900', 'dark:text-white');
    });

    // Test Case 3: Tagline is displayed correctly
    it('displays the tagline as subtitle', () => {
        render(<Introduction data={mockIntroductionData} />);

        const tagline = screen.getByText(mockIntroductionData.tagline);
        expect(tagline).toBeInTheDocument();
        expect(tagline.tagName).toBe('P');
        expect(tagline).toHaveClass('text-gray-600', 'dark:text-gray-300', 'mt-4');
    });

    // Test Case 4: Responsive classes are applied
    it('applies responsive CSS classes correctly', () => {
        render(<Introduction data={mockIntroductionData} />);

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveClass('text-3xl', 'sm:text-4xl', 'lg:text-5xl');

        const tagline = screen.getByText(mockIntroductionData.tagline);
        expect(tagline).toHaveClass('text-base', 'sm:text-lg');
    });

    // Test Case 5: Dark mode classes are present
    it('includes dark mode styling classes', () => {
        const { container } = render(<Introduction data={mockIntroductionData} />);

        const section = container.querySelector('section');
        expect(section).toHaveClass('dark:bg-gray-800');

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveClass('dark:text-white');

        const tagline = screen.getByText(mockIntroductionData.tagline);
        expect(tagline).toHaveClass('dark:text-gray-300');
    });

    // Test Case 6: Handles empty or missing data gracefully
    it('handles missing name or tagline gracefully', () => {
        const emptyData: IntroType = { name: '', tagline: '' };
        const { rerender } = render(<Introduction data={emptyData} />);

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('');

        const section = document.querySelector('section#introduction');
        expect(section).toBeInTheDocument();

        // Re-render with actual data to confirm it updates correctly
        rerender(<Introduction data={mockIntroductionData} />);
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Vince Ocampo');
        expect(screen.getByText(mockIntroductionData.tagline)).toBeInTheDocument();
    });
});