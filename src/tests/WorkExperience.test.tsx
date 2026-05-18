import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import WorkExperience from '../components/WorkExperience';
import type { Job } from '../types/resume';

const mockWorkExperienceData: Job[] = [
    {
        company: "Foster Moore - The registry people®",
        role: "Software Configuration Developer",
        period: "Sep 2025 – Present",
        details: [
            "Moved to Global Support Services: Helping maintain and provide fixes for existing business registers",
            "Part of release process for software updates and fixes for registers"
        ]
    },
    {
        company: "",
        role: "Junior Software Developer",
        period: "Nov 2023 – Aug 2025",
        details: [
            "Continued work on the CIPA upgrade project",
            "Became confident in using Groovy alongside Verne"
        ]
    },
    {
        company: "Doorknock",
        role: "Intern Software Developer",
        period: "Jul 2022 – Sep 2022",
        details: [
            "Assisted in building an MVP to validate the company's product concept",
            "Partnered with developers to convert UX designs into working website features"
        ]
    }
];

describe('WorkExperience Component', () => {
    // Test Case 1: Component renders with correct heading
    it('renders work experience section with correct heading', () => {
        render(<WorkExperience data={mockWorkExperienceData} />);

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Work Experience');
    });

    // Test Case 2: Groups jobs by company correctly
    it('groups jobs by company name correctly', () => {
        render(<WorkExperience data={mockWorkExperienceData} />);

        const companyHeadings = screen.getAllByRole('heading', { level: 3 });
        const headingTexts = companyHeadings.map(h => h.textContent);

        // Foster Moore should appear exactly once as a company heading
        expect(headingTexts.filter(t => t === 'Foster Moore - The registry people®')).toHaveLength(1);

        // Doorknock should appear exactly once as a separate company heading
        expect(headingTexts.filter(t => t === 'Doorknock')).toHaveLength(1);

        // Only two company groups should exist (empty-company job folds into Foster Moore)
        expect(companyHeadings).toHaveLength(2);

        // Both Foster Moore roles should be present in the document
        expect(screen.getByText('Software Configuration Developer')).toBeInTheDocument();
        expect(screen.getByText('Junior Software Developer')).toBeInTheDocument();
    });

    // Test Case 3: Displays job roles and periods
    it('displays job roles and periods correctly', () => {
        render(<WorkExperience data={mockWorkExperienceData} />);

        // All three roles should appear as h4 elements
        const roleHeadings = screen.getAllByRole('heading', { level: 4 });
        expect(roleHeadings).toHaveLength(3);

        const roleTitles = roleHeadings.map(h => h.textContent);
        expect(roleTitles).toContain('Software Configuration Developer');
        expect(roleTitles).toContain('Junior Software Developer');
        expect(roleTitles).toContain('Intern Software Developer');

        // All period strings should be present with correct styling
        const periods = [
            screen.getByText('Sep 2025 – Present'),
            screen.getByText('Nov 2023 – Aug 2025'),
            screen.getByText('Jul 2022 – Sep 2022'),
        ];
        periods.forEach(p => {
            expect(p).toBeInTheDocument();
            expect(p).toHaveClass('text-sm', 'text-gray-500', 'dark:text-gray-400');
        });
    });

    // Test Case 4: Renders job details as list items
    it('renders job details as unordered list items', () => {
        const { container } = render(<WorkExperience data={mockWorkExperienceData} />);

        // All detail strings should be present as <li> elements
        const allDetails = mockWorkExperienceData.flatMap(job => job.details);
        allDetails.forEach(detail => {
            expect(screen.getByText(detail)).toBeInTheDocument();
            expect(screen.getByText(detail).tagName).toBe('LI');
        });

        // Every <ul> should carry the list-disc and list-inside classes
        const lists = container.querySelectorAll('ul');
        expect(lists.length).toBeGreaterThan(0);
        lists.forEach(ul => {
            expect(ul).toHaveClass('list-disc', 'list-inside');
        });
    });

    // Test Case 5: Applies correct styling and layout classes
    it('applies correct styling and layout classes', () => {
        const { container } = render(<WorkExperience data={mockWorkExperienceData} />);

        // Section has correct background and responsive padding
        const section = container.querySelector('section');
        expect(section).toHaveClass('py-8', 'sm:py-12');
        expect(section).toHaveClass('bg-white', 'dark:bg-gray-900');

        // Company headings have blue border-bottom styling
        const companyHeadings = screen.getAllByRole('heading', { level: 3 });
        companyHeadings.forEach(heading => {
            expect(heading).toHaveClass('border-b-2', 'border-blue-600');
        });

        // Individual job entries have blue left-border styling
        const jobCards = container.querySelectorAll('.border-l-4');
        expect(jobCards.length).toBe(3);
        jobCards.forEach(card => {
            expect(card).toHaveClass('border-l-4', 'border-blue-600');
        });
    });

    // Test Case 6: Handles empty work experience array
    it('handles empty work experience array', () => {
        render(<WorkExperience data={[]} />);

        // Should not crash and the section heading should still render
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Work Experience');

        // No company or role headings should be present
        expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { level: 4 })).not.toBeInTheDocument();
    });

    // Test Case 7: Handles single job entry correctly
    it('handles single job entry correctly', () => {
        const singleJob = [mockWorkExperienceData[0]];
        render(<WorkExperience data={singleJob} />);

        // Exactly one company group and one role heading
        expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1);
        expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(1);

        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
            'Foster Moore - The registry people®'
        );
        expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
            'Software Configuration Developer'
        );

        // Only details from the single job should be present
        mockWorkExperienceData[0].details.forEach(detail => {
            expect(screen.getByText(detail)).toBeInTheDocument();
        });

        // Details from other jobs should not appear
        expect(screen.queryByText('Continued work on the CIPA upgrade project')).not.toBeInTheDocument();
        expect(screen.queryByText("Assisted in building an MVP to validate the company's product concept")).not.toBeInTheDocument();
    });
});