import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import Skills from '../components/Skills';
import type { SkillCategory } from '../types/resume';

const mockSkillsData: SkillCategory[] = [
    {
        "category": "Languages & Frameworks",
        "skills": ["Java", "Groovy", "Python", "JavaScript", "TypeScript", "HTML", "CSS", "React", "Gatsby", "Tailwind", "Sass"]
    },
    {
        "category": "Databases",
        "skills": ["MongoDB", "SQL", "NoSQL", "GraphQL", "Firestore"]
    },
    {
        "category": "Testing & Automation",
        "skills": ["Cucumber", "Gherkin", "Unit Testing (Python, Node.js)"]
    },
    {
        "category": "Tools & Version Control",
        "skills": ["Git", "GitHub", "GitLab", "Bitbucket", "Jira"]
    },
    {
        "category": "Data Analysis",
        "skills": ["R", "SAS", "Excel"]
    }
];

describe('Skills Component', () => {
    // Test Case 1: Component renders with correct heading
    it('renders skills section with correct heading', () => {
        render(<Skills data={mockSkillsData} />);

        const h2 = screen.getByRole('heading', { level: 2 });
        expect(h2).toHaveTextContent('Core Technical Skills');
    });

    // Test Case 2: Displays all skill categories
    it('displays all skill categories as headings', () => {
        render(<Skills data={mockSkillsData} />);

        const skillCategories = screen.getAllByRole('heading', { level: 3 });
        expect(skillCategories).toHaveLength(5);
        expect(skillCategories[0]).toHaveTextContent('Languages & Frameworks');
        expect(skillCategories[1]).toHaveTextContent('Databases');
        expect(skillCategories[2]).toHaveTextContent('Testing & Automation');
        expect(skillCategories[3]).toHaveTextContent('Tools & Version Control');
        expect(skillCategories[4]).toHaveTextContent('Data Analysis');
    });

    // Test Case 3: Renders individual skills as badges
    it('renders individual skills as styled badges', () => {
        const { container } = render(<Skills data={mockSkillsData} />);

        const allSkills = mockSkillsData.flatMap(c => c.skills);
        allSkills.forEach(skill => {
            expect(screen.getByText(skill)).toBeInTheDocument();
        });

        const badges = container.querySelectorAll('span.rounded-full');
        expect(badges).toHaveLength(allSkills.length);
        badges.forEach(badge => {
            expect(badge).toHaveClass('rounded-full', 'bg-blue-100', 'text-blue-700');
        });
    });

    // Test Case 4: Skills are grouped under correct categories
    it('groups skills under correct categories', () => {
        const { container } = render(<Skills data={mockSkillsData} />);

        const groups = container.querySelectorAll('.text-center');
        const findGroupForCategory = (categoryName: string) =>
            Array.from(groups).find(g => g.querySelector('h3')?.textContent === categoryName);

        const langGroup = findGroupForCategory('Languages & Frameworks');
        expect(langGroup?.querySelector('span')?.textContent).toBe('Java');

        const dbGroup = findGroupForCategory('Databases');
        expect(dbGroup?.querySelector('span')?.textContent).toBe('MongoDB');

        const toolsGroup = findGroupForCategory('Tools & Version Control');
        expect(toolsGroup?.querySelector('span')?.textContent).toBe('Git');
    });

    // Test Case 5: Applies responsive styling
    it('applies responsive CSS classes correctly', () => {
        const { container } = render(<Skills data={mockSkillsData} />);

        const badges = container.querySelectorAll('span.rounded-full');
        badges.forEach(badge => {
            expect(badge).toHaveClass('text-xs', 'sm:text-sm', 'px-3', 'sm:px-4');
        });
    });

    // Test Case 6: Uses flexbox for skill layout
    it('uses flexbox layout for skills', () => {
        const { container } = render(<Skills data={mockSkillsData} />);

        const skillContainers = container.querySelectorAll('.flex.flex-wrap.justify-center');
        expect(skillContainers).toHaveLength(mockSkillsData.length);
        skillContainers.forEach(skillContainer => {
            expect(skillContainer).toHaveClass('flex', 'flex-wrap', 'justify-center');
        });
    });

    // Test Case 7: Handles empty skills array
    it('handles empty skills array', () => {
        render(<Skills data={[]} />);

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Core Technical Skills');
        expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0);
    });

    // Test Case 8: Handles category with no skills
    it('handles category with empty skills array', () => {
        const dataWithEmptyCategory: SkillCategory[] = [
            { category: 'Empty Category', skills: [] },
            { category: 'Databases', skills: ['MongoDB'] }
        ];

        render(<Skills data={dataWithEmptyCategory} />);

        const categories = screen.getAllByRole('heading', { level: 3 });
        expect(categories).toHaveLength(2);
        expect(screen.getByText('Empty Category')).toBeInTheDocument();
        expect(screen.getByText('MongoDB')).toBeInTheDocument();
    });
});