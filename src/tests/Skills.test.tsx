import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Skills from '../components/Skills';
import type { SkillCategory } from '../types/resume';

const mockSkillsData: SkillCategory[] = [
    { category: 'Back-End', skills: ['Java', 'Python', 'Node.js'] },
    { category: 'Databases', skills: ['SQL', 'NoSQL'] },
    { category: 'Testing', skills: ['Unit Testing (Python, Node.js)', 'Python'] }
];

const getGroup = (category: string) =>
    screen.getByRole('heading', { level: 3, name: category }).parentElement!;

const getBadgeTexts = (group: HTMLElement) =>
    Array.from(group.querySelectorAll('span')).map(badge => badge.textContent);

describe('Skills Component', () => {
    // Test Case 1: Component renders with correct heading
    it('renders skills section with correct heading', () => {
        render(<Skills data={mockSkillsData} />);

        const h2 = screen.getByRole('heading', { level: 2 });
        expect(h2).toHaveTextContent('Core Technical Skills');
    });

    // Test Case 2: Displays all skill categories in order
    it('displays all skill categories as headings', () => {
        render(<Skills data={mockSkillsData} />);

        const headings = screen.getAllByRole('heading', { level: 3 });
        expect(headings.map(h => h.textContent)).toEqual(mockSkillsData.map(c => c.category));
    });

    // Test Case 3: Skills are grouped under correct categories, in order
    it('renders exactly the skills of each category under its heading', () => {
        render(<Skills data={mockSkillsData} />);

        mockSkillsData.forEach(({ category, skills }) => {
            expect(getBadgeTexts(getGroup(category))).toEqual(skills);
        });
    });

    // Test Case 4: Renders skills as pill badges
    it('renders individual skills as pill badges', () => {
        const { container } = render(<Skills data={mockSkillsData} />);

        const totalSkills = mockSkillsData.reduce((sum, c) => sum + c.skills.length, 0);
        expect(container.querySelectorAll('span.rounded-full')).toHaveLength(totalSkills);
    });

    // Test Case 5: Handles empty skills array
    it('handles empty skills array', () => {
        render(<Skills data={[]} />);

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Core Technical Skills');
        expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0);
    });

    // Test Case 6: Handles category with no skills
    it('renders no badges for a category with an empty skills array', () => {
        render(
            <Skills
                data={[
                    { category: 'Empty Category', skills: [] },
                    { category: 'Databases', skills: ['MongoDB'] }
                ]}
            />
        );

        expect(getBadgeTexts(getGroup('Empty Category'))).toEqual([]);
        expect(getBadgeTexts(getGroup('Databases'))).toEqual(['MongoDB']);
    });
});
