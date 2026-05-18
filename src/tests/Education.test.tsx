import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import Education from '../components/Education';
import type { EducationEntry } from '../types/resume';

const mockEducationData: EducationEntry[] = [
    {
        institution: "University of Auckland",
        degree: "Bachelor of Science – Computer Science & Statistics",
        year: "2018 – 2021"
    },
    {
        institution: "Mission Ready",
        degree: "Certificate in Digital Technology Product Solutions (Level 5)",
        year: "Apr 2022 – Jun 2022"
    },
    {
        institution: "Mission Ready",
        degree: "Certificate in Applied Technology Development Essentials (Level 6)",
        year: "Apr 2022 – Jun 2022"
    }
];

describe('Education Component', () => {
    // Test Case 1: Component renders with correct heading
    it('renders education section with correct heading', () => {
        render(<Education data={mockEducationData} />);

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Education');
    });

    // Test Case 2: Groups education by institution
    it('groups education entries by institution correctly', () => {
        render(<Education data={mockEducationData} />);

        // Each institution name appears as an h3 heading
        const institutionHeadings = screen.getAllByRole('heading', { level: 3 });
        const headingTexts = institutionHeadings.map(h => h.textContent);

        // "University of Auckland" should appear exactly once
        expect(headingTexts.filter(t => t === 'University of Auckland')).toHaveLength(1);

        // "Mission Ready" should appear exactly once (both certs grouped under it)
        expect(headingTexts.filter(t => t === 'Mission Ready')).toHaveLength(1);

        // Both Mission Ready certificates should be present in the document
        expect(screen.getByText('Certificate in Digital Technology Product Solutions (Level 5)')).toBeInTheDocument();
        expect(screen.getByText('Certificate in Applied Technology Development Essentials (Level 6)')).toBeInTheDocument();
    });

    // Test Case 3: Displays degree information correctly
    it('displays degree titles and years correctly', () => {
        render(<Education data={mockEducationData} />);

        // All degree titles should appear as h4 elements
        const degreeTitles = screen.getAllByRole('heading', { level: 4 });
        expect(degreeTitles).toHaveLength(3);
        expect(degreeTitles[0]).toHaveTextContent('Bachelor of Science – Computer Science & Statistics');
        expect(degreeTitles[1]).toHaveTextContent('Certificate in Digital Technology Product Solutions (Level 5)');
        expect(degreeTitles[2]).toHaveTextContent('Certificate in Applied Technology Development Essentials (Level 6)');

        // All year strings should be present
        expect(screen.getByText('2018 – 2021')).toBeInTheDocument();
        // Both Mission Ready entries share the same year string — getAllByText handles duplicates
        const missionReadyYears = screen.getAllByText('Apr 2022 – Jun 2022');
        expect(missionReadyYears).toHaveLength(2);
        missionReadyYears.forEach(el => expect(el).toHaveClass('text-sm', 'text-gray-500', 'dark:text-gray-400'));
    });

    // Test Case 4: Institution headings have correct styling
    it('applies correct styling to institution headings', () => {
        render(<Education data={mockEducationData} />);

        const institutionHeadings = screen.getAllByRole('heading', { level: 3 });
        institutionHeadings.forEach(heading => {
            expect(heading).toHaveClass('border-b-2', 'border-blue-600');
            expect(heading).toHaveClass('text-xl', 'sm:text-2xl');
            expect(heading).toHaveClass('text-gray-800', 'dark:text-gray-200');
        });
    });

    // Test Case 5: Handles single institution correctly
    it('handles single institution with multiple degrees', () => {
        const missionReadyOnly = mockEducationData.filter(e => e.institution === 'Mission Ready');
        render(<Education data={missionReadyOnly} />);

        // Only one institution heading should exist
        const institutionHeadings = screen.getAllByRole('heading', { level: 3 });
        expect(institutionHeadings).toHaveLength(1);
        expect(institutionHeadings[0]).toHaveTextContent('Mission Ready');

        // Both degrees should still appear
        expect(screen.getByText('Certificate in Digital Technology Product Solutions (Level 5)')).toBeInTheDocument();
        expect(screen.getByText('Certificate in Applied Technology Development Essentials (Level 6)')).toBeInTheDocument();
    });

    // Test Case 6: Handles empty education array
    it('handles empty education array', () => {
        render(<Education data={[]} />);

        // Should not crash and heading should still render
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Education');

        // No institution or degree headings should be present
        expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { level: 4 })).not.toBeInTheDocument();
    });

    // Test Case 7: Responsive classes are applied
    it('applies responsive CSS classes correctly', () => {
        const { container } = render(<Education data={mockEducationData} />);

        // Section has responsive vertical padding
        const section = container.querySelector('section');
        expect(section).toHaveClass('py-8', 'sm:py-12');

        // Section wrapper has responsive horizontal padding
        const wrapper = container.querySelector('.container');
        expect(wrapper).toHaveClass('px-4');

        // h2 has responsive text sizing
        const h2 = screen.getByRole('heading', { level: 2 });
        expect(h2).toHaveClass('text-2xl', 'sm:text-3xl');

        // Each institution card has responsive padding
        const cards = container.querySelectorAll('.rounded-2xl');
        cards.forEach(card => expect(card).toHaveClass('p-4', 'sm:p-6'));
    });
});